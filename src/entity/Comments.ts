import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comments extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public movieId: number;

    @Column({ nullable: true, default: '' })
    public ipAddress: string;

    @Column()
    public message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default Comments;