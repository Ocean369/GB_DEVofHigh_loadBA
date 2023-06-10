import { IsString, IsNumber, ValidateIf, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditNewsDto {
    @ApiProperty({
        type: String,
        description: 'Заголовок статьи',
        example: 'News Title'
    })
    @IsString()
    @ValidateIf((o) => o.title)
    title: string;

    @ApiProperty({
        type: String,
        description: 'Текс статьи',
        example: 'Once upon a time...'
    })
    @IsString()
    @ValidateIf((o) => o.description)
    description: string;

    @ApiProperty({
        type: String,
        description: 'Обложка новости',
        example: 'https://img.freepik.com/premium-photo/3d-illustration-globe-word-news-black-background-business-international-media-concept_556904-736.jpg?w=2000'
    })
    @ValidateIf((o) => o.cover)
    cover: string;
}