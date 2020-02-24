import { IStringIdentifiable } from 'pip-services3-commons-node';

export class CommentV1 implements IStringIdentifiable {
    public id: string; 
    public parent_id: string;
    public content: string;
    public author_id: string;
    public create_time: string;
    public update_time?: string;
    public like_count: number;
    public dislike_count: number;
    public type?: string;
    public archive_time?:string;
}