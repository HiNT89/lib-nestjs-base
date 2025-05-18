import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AbstractDto } from "./abstract.dto";


export abstract class AbstractEntity<
DTO extends AbstractDto = AbstractDto,
O = never,
> {
    @PrimaryGeneratedColumn("increment")
    @Index()
    id: number;

    // @PrimaryGeneratedColumn("uuid")
    // mitu_code: string;

    @ApiProperty({
        example: "create time",
    })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty({
        example: "update time",
    })
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  
    @Column({ default: true })
    is_active: boolean;

    toDto(options?: O): DTO {
        const dtoClass = Object.getPrototypeOf(this).dtoClass;

        if (!dtoClass) {
            throw new Error(
                `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
            );
        }

        return new dtoClass(this, options);
    }
}