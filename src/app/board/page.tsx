"use client"

import { useRef, useState } from "react";
import Image from "next/image";
import { getInitialBoard, range, createPiece } from "@/utils/utils";
import { getPossibleMoves } from "@/utils/move";
import { Piece } from "../../../public/types/piece";
import Background from "../../../public/assets/board.png";

export default function Board() {
    const initialBoard = getInitialBoard()
    const [board, setBoard]: any = useState(initialBoard);
    const [bgColor, setBGColor] = useState("transparent");

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

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        // let element: any = event.target;
        // element.style.backgroundColor = "rgba(235, 97, 80, 0.8)";
        // setBGColor("rgba(235, 97, 80, 0.8)");
    }

    const handleClick = (piece: Piece) => (event: React.MouseEvent) => {
        // setBGColor("transparent");
        console.log(piece);
        console.log(getPossibleMoves(piece, board))
    }

    const makeMove = (piece: Piece, position: string) => {
        console.log(piece);
        let possibleMoves = getPossibleMoves(piece, board);
        if(possibleMoves.includes(position)) {
            let updatedBoard: any = board;
            updatedBoard[piece.position] = null;
            piece.position = position;
            piece.moveCount = piece.moveCount + 1;
            updatedBoard[position] = piece;
            setBoard({...updatedBoard});
        }
    }

    const test = () => {
        let piece = createPiece("d5", "pawn", "black", 2);
        let updatedBoard = board;
        updatedBoard[piece.position] = piece;
        setBoard({...updatedBoard});
        getPossibleMoves(piece, board).forEach(move => {
            let el: any = document.getElementById(move);
            el.style.backgroundColor = "pink";
        }) 
    }

    return(
        <div className="container">
            <div className="board" style={{width: '800px', height: '800px', backgroundImage: `url(${Background.src})`, backgroundSize: 'auto'}}>
                {range(0, 8).map(index => (
                    <div key={index} className="row" style={{display: 'flex', justifyContent: 'center', backgroundColor: bgColor}}>
                        {Object.keys(board).slice(index*8, (index+1)*8).map(square =>
                            <div
                                key={square}
                                className={square[0]} 
                                id={square}
                                style={{width: '100px', height: '100px', position: 'relative', backgroundColor: "inherit"}}
                                onDragStart={handleDragStart(board[square])}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onContextMenu={handleContextMenu}
                                onClick={handleClick(board[square])}>
                                {board[square] && <Image src={board[square].image} fill alt=""></Image>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={test}>click</button>
        </div>
    )
}