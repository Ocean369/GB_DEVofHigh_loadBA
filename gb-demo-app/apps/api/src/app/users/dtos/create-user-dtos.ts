import { IsNotEmpty, IsString, ValidateIf, IsEnum } from 'class-validator';
import { Role } from '../../auth/role/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'Имя пользователя',
        example: 'Alex'
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({
        type: String,
        description: 'email пользователя',
        example: 'example@mail.com'
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        type: String,
        description: ' password',
        example: '12341234'
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        enum: ['Admin', 'Moderator', 'User'],
        description: 'Роль пользователя',
        default: 'User'
    })
    @IsNotEmpty()
    @IsEnum(Role)
    roles: Role;

    @ApiProperty({
        type: String,
        description: 'Аватар пользователя',
        example: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png'
    })
    @ValidateIf((o) => o.avatar)
    avatar: string;
}