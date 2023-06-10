export function EditComment(props) {

    this.state = {
        message: props.message,
    };

    onChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    };

    editMessage = () => {
        this.socket.emit('addComment', {
            idNews: this.idNews,
            message: this.state.message,
        });
    };

    return (
        <div>
            <textarea
                className="form-control"
                placeholder="Leave a comment here"
                value={this.state.message}
                name="message"
                onChange={this.onChange}
            >{message}</textarea>
            <button
                onClick={this.editMessage}
                className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold">
                Edit
            </button>
        </div>
    )
}

export function Message(props) {
    return <div>{props.message}</div>
}