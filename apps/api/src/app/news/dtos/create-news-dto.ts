import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
    @ApiProperty({
        type: String,
        description: 'Заголовок статьи',
        example: 'News Title'
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        type: String,
        description: 'Текс статьи',
        example: 'Once upon a time...'
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        type: String,
        description: 'автор статьи',
        example: 'Masha'
    })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({
        type: String,
        description: 'Обложка новости',
        example: 'https://img.freepik.com/premium-photo/3d-illustration-globe-word-news-black-background-business-international-media-concept_556904-736.jpg?w=2000'
    })
    @ValidateIf((o) => o.cover)
    cover: string;
}
