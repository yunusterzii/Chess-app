export interface Piece {
    position: string;
    image: any;
    type: string;
    color: string;
    moveCount: number;
}

export interface Board { 
    [key: string]: Piece | null;
}