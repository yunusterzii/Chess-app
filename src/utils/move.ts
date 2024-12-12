import { Piece } from "../../public/types/piece";
import { toBoardPosition, toNumberPosition } from "./utils";

const moveTable: any = {
    "knight": {moves: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]], iterative: false},
    "bishop": {moves: [[1, 1], [1, -1], [-1, 1], [-1, -1]], iterative: true},
    "queen": {moves: [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], iterative: true},
    "rook": {moves: [[1, 0], [0, 1], [-1, 0], [0, -1]], iterative: true},
    "king": {moves: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], iterative: false},
    "white-pawn": {moves: [[1, 0]], attack: [[1, 1], [1, -1]], firstMove: [2, 0], iterative: false},
    "black-pawn": {moves: [[-1, 0]], attack: [[-1, 1], [-1, -1]], firstMove: [-2, 0], iterative: false},
}
export function getPossibleMoves(piece: Piece, board: any): string[] {
    let possibleMoves: string[] = [];
    let moves;
    let table;
    if(piece.type == "pawn") {
        table = moveTable[piece.color + "-" + piece.type];
        moves = table.moves;
        let position = toNumberPosition(piece.position);
        let dest = [position[0] + moves[0][0], position[1] + moves[0][1]];
        let square = toBoardPosition(dest);
        if(board[square]) {
            moves = [];
        }
        table.attack.forEach((move: number[]) => {
            let dest = [position[0] + move[0], position[1] + move[1]];
            let square = toBoardPosition(dest);
            if(board[square] && board[square].color != piece.color) {
                moves.push(move);
            }
        })
        console.log(piece.moveCount);
        if(piece.moveCount == 0) {
            moves.push(table.firstMove);
        }
        console.log(moves);
    }
    else {
        table = moveTable[piece.type];
        moves = table.moves;
    }
    moves.forEach((move: number[]) => {
        let position = toNumberPosition(piece.position);
        do {
            let dest = [position[0] + move[0], position[1] + move[1]];
            if(dest[0] > 8 || dest[0] < 1 || dest[1] > 8 || dest[1] < 1) break;
            let square = toBoardPosition(dest);
            if((board[square] && board[square].color != piece.color && board[square].type != "king") || !board[square]) {
                possibleMoves.push(square);
            }
            if(board[square]) break;
            position = dest;
        } while(table.iterative);
    })

    return possibleMoves;
}
