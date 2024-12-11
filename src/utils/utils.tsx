import svgPathWhiteKing from "../../public/assets/white-king.svg";
import svgPathWhiteQueen from "../../public/assets/white-queen.svg";
import svgPathWhiteRook from "../../public/assets/white-rook.svg";
import svgPathWhiteBishop from "../../public/assets/white-bishop.svg";
import svgPathWhiteKnigt from "../../public/assets/white-knight.svg";
import svgPathWhitePawn from "../../public/assets/white-pawn.svg";
import svgPathBlackKing from "../../public/assets/black-king.svg";
import svgPathBlackQueen from "../../public/assets/black-queen.svg";
import svgPathBlackRook from "../../public/assets/black-rook.svg";
import svgPathBlackBishop from "../../public/assets/black-bishop.svg";
import svgPathBlackKnigt from "../../public/assets/black-knight.svg";
import svgPathBlackPawn from "../../public/assets/black-pawn.svg";
import { Piece } from "../../public/types/piece";


const svgMap: any = {
    "white-king" : svgPathWhiteKing,
    "white-queen" : svgPathWhiteQueen,
    "white-rook" : svgPathWhiteRook,
    "white-bishop" : svgPathWhiteBishop,
    "white-knight" : svgPathWhiteKnigt,
    "white-pawn" : svgPathWhitePawn,
    "black-king" : svgPathBlackKing,
    "black-queen" : svgPathBlackQueen,
    "black-rook" : svgPathBlackRook,
    "black-bishop" : svgPathBlackBishop,
    "black-knight" : svgPathBlackKnigt,
    "black-pawn" : svgPathBlackPawn,
}
export function getInitialBoard() {
    return(
        {
            'a1': createPiece("a1", "rook", "white"),
            'b1': createPiece("b1", "bishop", "white"), 
            'c1': createPiece("c1", "knight", "white"), 
            'd1': createPiece("d1", "queen", "white"),
            'e1': createPiece("e1", "king", "white"), 
            'f1': createPiece("d1", "bishop", "white"),
            'g1': createPiece("g1", "knight", "white"), 
            'h1': createPiece("h1", "rook", "white"),
            'a2': createPiece("a2", "pawn", "white"),
            'b2': createPiece("b2", "pawn", "white"), 
            'c2': createPiece("c2", "pawn", "white"), 
            'd2': createPiece("d2", "pawn", "white"), 
            'e2': createPiece("e2", "pawn", "white"), 
            'f2': createPiece("f2", "pawn", "white"), 
            'g2': createPiece("g2", "pawn", "white"), 
            'h2': createPiece("h2", "pawn", "white"),
            'a3': null, 'b3': null, 'c3': null, 'd3': null, 'e3': null, 'f3': null, 'g3': null, 'h3': null,
            'a4': null, 'b4': null, 'c4': null, 'd4': null, 'e4': null, 'f4': null, 'g4': null, 'h4': null,
            'a5': null, 'b5': null, 'c5': null, 'd5': null, 'e5': null, 'f5': null, 'g5': null, 'h5': null,
            'a6': null, 'b6': null, 'c6': null, 'd6': null, 'e6': null, 'f6': null, 'g6': null, 'h6': null,
            'a7': createPiece("a7", "pawn", "black"), 
            'b7': createPiece("b7", "pawn", "black"), 
            'c7': createPiece("c7", "pawn", "black"), 
            'd7': createPiece("d7", "pawn", "black"), 
            'e7': createPiece("e7", "pawn", "black"), 
            'f7': createPiece("f7", "pawn", "black"), 
            'g7': createPiece("g7", "pawn", "black"), 
            'h7': createPiece("h7", "pawn", "black"),
            'a8': createPiece("a8", "rook", "black"), 
            'b8': createPiece("b8", "bishop", "black"), 
            'c8': createPiece("c8", "knight", "black"), 
            'd8': createPiece("d8", "queen", "black"), 
            'e8': createPiece("e8", "king", "black"), 
            'f8': createPiece("f8", "bishop", "black"), 
            'g8': createPiece("g8", "knight", "black"), 
            'h8': createPiece("h8", "rook", "black"),
        }
    )
}

export function createPiece(position: string, type: string, color: string): Piece {
    return(
        {
            position: position,
            image: svgMap[`${color}-${type}`],
            type: type,
            color: color,
        }
    )
}

export function range(start: number, end: number): number[] {
    return Array.from({length: (end - start + 1)}, (_, i) => start + i);
}