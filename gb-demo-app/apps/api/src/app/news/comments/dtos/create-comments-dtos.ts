import { IsNotEmpty, IsString, ValidateIf, IsArray, IsNumber } from 'class-validator';
import { Reply } from '../comments.service';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({
        type: String,
        description: 'Текст комментария',
        example: 'A good news!'
    })
    @IsNotEmpty()
    @IsString()
    message: string;
}