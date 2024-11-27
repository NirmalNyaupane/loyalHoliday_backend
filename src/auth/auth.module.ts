import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    UserModule, 
    MongooseModule.forFeature([{
      name:User.name, 
      schema:UserSchema
    }])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
