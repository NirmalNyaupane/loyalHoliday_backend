import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    oldPassword:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    newPassword:string;

    userId:string;
}