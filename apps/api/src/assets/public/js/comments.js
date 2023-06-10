"use strict";
const e = React.createElement;
class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            message: '',
            messageEdit: '',
            isEdit: {},
            isUpdateComment: 'none',
            isAuthorized: false
        };
        // Парсим строку, извлекаем id новости
        this.idNews = parseInt(window.location.href.split('/').reverse()[1]);
        this.bearerToken = getCookie('jwt');

        // if (bearerToken) {
        //     this.setState({ isAuthorized: true });
        // } else { this.setState({ isAuthorized: false }); }

        this.idUser = getCookie('idUser');

        this.socket = io('/', {
            query: {
                // Устанавливаем id новости, он потребуется серверу для назначения комнаты пользователю
                newsId: this.idNews,
            },
            transportOptions: {
                polling: {

                },
            },
        });
    }

    componentDidMount() {
        // Вызываем метод получения всех комментариев
        this.getAllComments();

        if (this.idUser) {
            this.setState({ isAuthorized: true });
        } else { this.setState({ isAuthorized: false }); }

        this.socket.on('newComment', (message) => {
            const comments = this.state.comments;
            comments.push(message);
            this.setState(comments);
        });

        this.socket.on('removeComment', (payload) => {
            const { id } = payload;
            // Оставляем комментарии, которые не равны удалённому id комментария
            const comments = this.state.comments.filter((c) => c.id !== Number(id));
            this.setState({ comments });
        });

        this.socket.on('editComment', (payload) => {
            const { id, message } = payload;
            console.log('old', this.state.comments);
            console.log('id and message', id, message);
            const editcomments = this.state.comments.map((c) => {
                if (c.id === id) {
                    c.message = message
                }
                return c
            });
            console.log('edited', editcomments);

            console.log('old EditUpdate ', this.state.isEdit);
            let isEditUpdate = this.state.isEdit;
            for (const keyId in isEditUpdate) {
                if (id === Number(keyId)) {
                    isEditUpdate[keyId] = true
                }
            }
            console.log('new EditUpdate ', isEditUpdate);

            this.setState({ comments: editcomments });
            this.setState({ isEdit: isEditUpdate });
        });
    }

    // Метод получения всех комментариев
    getAllComments = async () => {
        const response = await fetch(
            `/comments/all?idNews=${this.idNews}`,
            {
                method: 'GET',
            },
        );
        if (response.ok) {
            const comments = await response.json();
            this.setState({ comments });
            let editComm = {};
            this.state.comments.forEach(c => {
                editComm[c.id] = false
            })
            this.setState({ isEdit: editComm })
        }
    };

    onChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    };

    sendMessage = () => {
        this.socket.emit('addComment', {
            idNews: this.idNews,
            message: this.state.message,
        });
        this.setState({ message: '' });
    };

    editComment = (event) => {
        this.setState({ isUpdateComment: 'block' });
        const idComm = event.target.dataset['id'];
        document.getElementById('updateMessage').setAttribute('data-id', idComm);
        const parentBlock = event.target.parentElement.parentElement.children[1];
        // const name = parentBlock.firstChild.textContent;
        this.setState({ messageEdit: parentBlock.firstChild.nextSibling.textContent });
    }

    deleteCommment = async (event) => {
        console.log('delete on click');
        const idComm = event.target.dataset['id'];
        this.socket.emit('deleteComment', {
            idNews: this.idNews,
            idComm: idComm
        });
        // const bearerToken = getCookie('jwt');     
    }

    updateMessage = async (event) => {
        const idComm = event.target.dataset['id'];
        const accessToken = getCookie('jwt');

        try {
            const response = await fetch(
                `/comments/api/${idComm}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ message: this.state.messageEdit }),
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            this.setState({ isUpdateComment: 'none', messageEdit: '' });
        } catch (error) {
            console.error(`HTTP error! Status: ${error.message}`);
        }
    }

    render() {
        return (
            <div>
                {this.state.comments.map((comment, index) => {
                    const avatar = comment.user.avatar
                        ? comment.user.avatar
                        : 'https://painrehabproducts.com/wp-content/uploads/2014/10/facebook-default-no-profile-pic.jpg';

                    return (

                        <div key={comment + index} className="card mb-1" style={{ position: 'relative' }}>
                            <div className=" d-flex justify-content-start" style={{ gap: '30px', flexDirection: 'row' }}>
                                <div style={{ padding: '5px' }}>
                                    <img className="mr-3 rounded"
                                        src={avatar}
                                        alt=""
                                        style={{ width: '75px', height: '75px', background: 'grey' }}>
                                    </img>
                                </div>
                                <div className="card-body">
                                    <strong>{comment.user.firstName}</strong>
                                    <div>
                                        {comment.message}
                                    </div>
                                </div>
                                {comment.user.id === Number(this.idUser)
                                    ? <div style={{ margin: '10px' }}>
                                        <img src="/news_static/pen_1.png"
                                            style={{ width: '20px', height: '20px', cursor: 'pointer', verticalAlign: 'top' }}
                                            data-id={comment.id} onClick={this.editComment}>
                                        </img>
                                        <img src="/news_static/bin.png"
                                            style={{ height: '20px', width: '20px', cursor: 'pointer', verticalAlign: 'top' }} alt=""
                                            onClick={this.deleteCommment} data-id={comment.id} />
                                    </div>
                                    : ''
                                }
                            </div>
                            {this.state.isEdit[comment.id]
                                ? <p style={{ color: '#31c5ce', fontSize: '10px', textAlign: 'end', paddingRight: '20px', margin: 0 }}>комментарий изменен</p>
                                : ''}
                        </div>
                    );
                })
                }
                <hr />
                {this.state.isAuthorized
                    ? <div id='formAddComment'>
                        <h6 className="lh-1 mt-3">Форма добавления комментариев</h6>
                        <div className="form-floating mb-1">
                            <textarea
                                className="form-control"
                                placeholder="Leave a comment here"
                                value={this.state.message}
                                name="message"
                                onChange={this.onChange}
                            ></textarea>
                            <label htmlFor="floatingmessagearea2">Комментарий</label>
                        </div>
                        <button
                            onClick={this.sendMessage}
                            className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
                        >
                            Send
                        </button>
                    </div>
                    : ''}

                <div className='editForm' style={{
                    position: 'absolute',
                    zIndex: 100,
                    top: '50%', left: '50px',
                    border: '1px solid black',
                    background: 'white',
                    padding: '25px',
                    width: '90%',
                    display: `${this.state.isUpdateComment}`
                }}>
                    <img src='/news_static/delete.png' alt='icon close' style={{ width: '15px', height: '15px', verticalAlign: 'top', float: 'right' }} onClick={() => {
                        this.setState({ isUpdateComment: 'none' })
                    }} />
                    <h2>Редактирование комментария</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="messageInput" className="form-label">Текст комментария</label>
                            <textarea className="form-control"
                                name="messageEdit"
                                id="messageInput"
                                rows="3"
                                value={this.state.messageEdit}
                                onChange={this.onChange}></textarea>
                        </div>
                        <button type="button" id='updateMessage' className="btn btn-primary" onClick={this.updateMessage} >Редактировать</button>
                    </form>
                </div>

            </div >
        );
    }
}
const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);