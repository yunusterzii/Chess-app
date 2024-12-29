import { Piece, Board } from "../../public/types/piece";
import { notNull } from "../../public/types/guards";
import { toBoardPosition, toNumberPosition } from "./utils";

const moveTable: any = {
    "knight": {moves: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]], iterative: false},
    "bishop": {moves: [[1, 1], [1, -1], [-1, 1], [-1, -1]], iterative: true},
    "queen": {moves: [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], iterative: true},
    "rook": {moves: [[1, 0], [0, 1], [-1, 0], [0, -1]], iterative: true},
    "king": {moves: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], iterative: false},
    "white-pawn": {moves: [1, 0], attack: [[1, 1], [1, -1]], doubleMove: [2, 0], iterative: false},
    "black-pawn": {moves: [-1, 0], attack: [[-1, 1], [-1, -1]], doubleMove: [-2, 0], iterative: false},
    "castle": {"a1": ["b1", "c1"], "h1": ["e1", "f1", "g1"], "a8": ["b8", "c8"], "h8": ["e8", "f8", "g8"]}
}
export function getPossibleMoves(piece: Piece, board: Board): string[] {
    let possibleMoves: string[] = [];
    let table = moveTable[piece.type];
    let moves = table ? table.moves : [];
    moves.forEach((move: number[]) => {
        let position = toNumberPosition(piece.position);
        do {
            let dest = [position[0] + move[0], position[1] + move[1]];
            if(dest[0] > 8 || dest[0] < 1 || dest[1] > 8 || dest[1] < 1) break;
            let square = toBoardPosition(dest);
            if((board[square] && board[square].color != piece.color) || !board[square]) {
                possibleMoves.push(square);
            }
            if(board[square]) break;
            position = dest;
        } while(table.iterative);
    })
    if(piece.type === "pawn") {
        table = moveTable[piece.color + '-' + piece.type];
        moves = table.moves;
        let move = pawnMove(piece, board, table);
        if(move.length) possibleMoves.push(toBoardPosition(move));
        let doubleMove = pawnDoubleMove(piece, board, table);
        if(doubleMove.length) possibleMoves.push(toBoardPosition(doubleMove));
        let attackMoves = pawnAttackMoves(piece, board, table);
        if(attackMoves.length) possibleMoves.push(...attackMoves.map(attackMove => toBoardPosition(attackMove)));
        let enPassantMove = pawnEnPassantMove(piece, board);
        if(enPassantMove.length) possibleMoves.push(toBoardPosition(enPassantMove));
    }
    else if(piece.type === "king") {
        let castleMoves = kingCastleMoves(piece, board);
        possibleMoves.push(...castleMoves);
        let color = piece.color === "white" ? "black" : "white";
        let preventedMoves = getProtectedSquares(color, board);
        possibleMoves = possibleMoves.filter(move => !preventedMoves.includes(move));
    }

    return possibleMoves;
}

function getProtectedSquares(color: string, board: Board): string[] {
    let pieces = Object.values(board).filter(notNull);
    let protectedSquares: string[] = [];
    for(let piece of pieces) {
        if(piece.color != color) continue;
        let table = moveTable[piece.type];
        let moves = table ? table.moves : [];
        if(piece.type === "pawn") { 
            table = moveTable[color + "-" + piece.type];
            moves = table.attack;
        }
        moves.forEach((move: number[]) => {
            let position = toNumberPosition(piece.position);
            do {
                let dest = [position[0] + move[0], position[1] + move[1]];
                if(dest[0] > 8 || dest[0] < 1 || dest[1] > 8 || dest[1] < 1) break;
                let square = toBoardPosition(dest);
                if(board[square]?.color === color) {
                    protectedSquares.push(square);
                    break;
                }
                else if(board[square] && board[square].type !== "king") break;  
                protectedSquares.push(square);
                position = dest;
            } while(table.iterative);
        })
    }
    return [...new Set(protectedSquares)];
}   


function pawnMove(pawn: Piece, board: Board, table: any) {
    let move = table.moves;
    let position = toNumberPosition(pawn.position);
    let dest = [position[0] + move[0], position[1]];
    if(dest[0] > 8 || dest[0] < 1 || dest[1] > 8 || dest[1] < 1) return [];
    let destSquare = toBoardPosition(dest);
    if(!board[destSquare]) {
        return dest;
    }
    return [] 
}

function pawnDoubleMove(pawn: Piece, board: Board, table: any): number[] {
    let doubleMove = table.doubleMove;
    let position = toNumberPosition(pawn.position);
    let dest = [position[0] + table.moves[0], position[1]];
    if(dest[0] > 8 || dest[0] < 1 || dest[1] > 8 || dest[1] < 1) return [];
    let doubleDest = [position[0] + doubleMove[0], position[1]];
    if(doubleDest[0] > 8 || doubleDest[0] < 1 || doubleDest[1] > 8 || doubleDest[1] < 1) return [];
    let doubleDestSquare = toBoardPosition(doubleDest);
    let destSquare = toBoardPosition(dest);
    if(!board[destSquare] && !board[doubleDestSquare] && pawn.moveCount == 0) {
        return doubleDest;
    }
    return []
}

function pawnAttackMoves(pawn: Piece, board: Board, table: any): number[][] {
    let moves: number[][] = [];
    let position = toNumberPosition(pawn.position);
    table.attack.forEach((move: number[]) => {
        let dest = [position[0] + move[0], position[1] + move[1]];
        if(dest[0] > 8 || dest[0] < 1 || dest[1] > 8 || dest[1] < 1) return [];
        let square = toBoardPosition(dest);
        if(board[square] && board[square].color != pawn.color) {
            moves.push(dest);
        }
    })
    return moves;
}

function pawnEnPassantMove(pawn: Piece, board: Board): number[] {
    let moves = [[0, 1], [0, -1]];
    let position = toNumberPosition(pawn.position);
    for(let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let dest = [position[0], position[1] + move[1]];
        if(dest[0] > 8 || dest[0] < 1 || dest[1] > 8 || dest[1] < 1) return [];
        let square = toBoardPosition(dest);
        if(board[square] && board[square].type === "pawn" && board[square].color != pawn.color) {   // TODO: should add board move count
            return dest;
        }
    }
    return [];
}

function kingCastleMoves(king: Piece, board: Board): string[] {
    let castleSquares: string[] = [];
    if(king.moveCount !== 0) return [];
    let pieces = Object.values(board).filter(notNull);
    let rooks = pieces.filter(piece => piece.type === "rook" && piece.color === king.color && piece.moveCount === 0);
    rooks.forEach(rook => {
        let table = moveTable["castle"];
        let positions: string[] = table[rook.position];
        let oppColor = king.color === "white" ? "black" : "white";
        let protectedSquares = getProtectedSquares(oppColor, board);
        if(!positions.some(position => protectedSquares.includes(position) || board[position])) castleSquares.push(rook.position);
    });

    return castleSquares;
}
