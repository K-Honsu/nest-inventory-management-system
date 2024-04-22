// import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from "class-validator";

enum Gender {
    MALE,
    FEMALE
}

// export class createCustomerDto {
//     @IsNotEmpty()
//     @IsString()
//     readonly first_name: string

//     @IsNotEmpty()
//     @IsString()
//     readonly last_name: string

//     @IsNotEmpty()
//     @IsEmail({}, { message: 'Please enter correct email' })
//     readonly email: string;

//     @IsNotEmpty()
//     @IsString()
//     @IsEnum(Gender)
//     readonly gender: string

//     @IsNotEmpty()
//     @IsString()
//     @MinLength(6)
//     readonly password: string;
// }

export interface createCustomerDto {
    first_name: string;
    last_name: string;
    email: string;
    gender: Gender; // Use the Gender enum type from Prisma
    password: string;
  }
  