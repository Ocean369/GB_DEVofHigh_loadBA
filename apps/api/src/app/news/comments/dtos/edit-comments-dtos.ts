import { IsString, IsNumber, ValidateIf, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditCommentDto {
    @ApiProperty({
        type: String,
        description: 'Текст комментария',
        example: 'A good news!'
    })
    @IsString()
    @ValidateIf((o) => o.message)
    message: string;
}