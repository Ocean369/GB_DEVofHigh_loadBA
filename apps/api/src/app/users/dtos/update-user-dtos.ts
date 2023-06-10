import { IsNotEmpty, IsString, ValidateIf, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        type: String,
        description: 'Имя пользователя',
        example: 'Alex'
    })
    @IsNotEmpty()
    @IsString()
    @ValidateIf((o) => o.firstname)
    firstName: string;

    @ApiProperty({
        type: String,
        description: 'email пользователя',
        example: 'example@mail.com'
    })
    @IsNotEmpty()
    @IsString()
    @ValidateIf((o) => o.email)
    email: string;

    @ApiProperty({
        type: String,
        description: ' password',
        example: '12341234'
    })
    @IsString()
    @ValidateIf((o) => o.password)
    password: string;

    @ApiProperty({
        type: String,
        description: 'Аватар пользователя',
        example: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png'
    })
    @ValidateIf((o) => o.avatar)
    avatar: string;
}