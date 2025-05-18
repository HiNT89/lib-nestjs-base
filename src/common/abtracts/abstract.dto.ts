import { AbstractEntity } from "./abstract.entity";

  export class AbstractDto {
    id!: number;
  
    created_at!: Date;
  
    updated_at!: Date;

    is_active!: boolean;
  
    constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
      if (!options?.excludeFields) {
        this.id = entity.id;
        this.created_at = entity.created_at;
        this.updated_at = entity.updated_at;
        this.is_active = entity.is_active;
      }
    }
  }
  
 
  