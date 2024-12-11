"use client"

import { useRef, useState } from "react";
import Image from "next/image";
import { getInitialBoard, range } from "@/utils/utils";
import { Piece } from "../../../public/types/piece";

export default function Board() {
    const initialBoard = getInitialBoard()
    const [board, setBoard]: any = useState(initialBoard);

    const handleDragStart = (piece: Piece) => (event: React.DragEvent<HTMLImageElement>) => {
        event.dataTransfer.setData('application/json', JSON.stringify(piece));
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const piece = JSON.parse(event.dataTransfer.getData('application/json'));
        const position = event.currentTarget.getAttribute('id');
        if (position) makeMove(piece, position);
    }

    const handleDragOver = (event: React.DragEvent<HTMLImageElement>) => {
        event.preventDefault();
    }

    const makeMove = (piece: Piece, position: string) => {
        let updatedBoard = board;
        updatedBoard[piece.position] = null;
        piece.position = position;
        updatedBoard[position] = piece;
        setBoard({...updatedBoard});
    }

    return(
        <div className="container">
            <div className="board">
                {range(0, 8).map(index => (
                    <div key={index} className="row" style={{display: 'flex', justifyContent: 'center'}}>
                        {Object.keys(board).slice(index*8, (index+1)*8).map(square =>
                            <div
                                key={square}
                                className={square[0]} 
                                id={square}
                                style={{backgroundColor: (square[0].charCodeAt(0) + Number(square[1])) % 2 == 0 ? 'white' : 'black', width: '100px', height: '100px', color: 'yellow', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}
                                onDragStart={handleDragStart(board[square])}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}>
                                {board[square] && <Image src={board[square].image} fill alt=""></Image>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}