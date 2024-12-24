"use client"

import styles from "./styles.module.css";
import { useRef, useState } from "react";
import { getInitialBoard } from "@/utils/utils";
import { getPossibleMoves } from "@/utils/move";
import { Piece, Board } from "../../../public/types/piece";
import Image from "next/image";

export default function BoardComponent() {
    const initialBoard: Board = getInitialBoard()
    const [board, setBoard] = useState<Board>(initialBoard);
    const [hintSquares, setHintSquares]: any = useState([]);
    const [highlightSquares, setHighlightSquares]: any = useState([]);
    const [checkSquare, setCheckSquare]: any = useState(null);

    const handleDragStart = (piece: Piece) => (event: React.DragEvent<HTMLImageElement>) => {
        event.dataTransfer.setData('application/json', JSON.stringify(piece));
    }

    const handleDragOver = (event: React.DragEvent<HTMLImageElement>) => {
        event.preventDefault();
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const piece = JSON.parse(event.dataTransfer.getData('application/json'));
        const position = coordinatesToSquare(event.clientX, event.clientY);
        if (position) {
            makeMove(piece, position);
            setHintSquares([]);
        } 
    }

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        const square = coordinatesToSquare(event.clientX, event.clientY);
        if(highlightSquares.map((el: any) => el.key).includes(square)) return;
        setHighlightSquares([...highlightSquares, 
        <div key={square} className={styles.highlight} style={{transform: squareToTranslate(square)}}></div>])
    }

    const handlePieceClick = (piece: Piece) => (event: React.MouseEvent) => {
        event.stopPropagation();
        if(hintSquares.length > 0) {
            setHintSquares([]);
            return;
        };
        drawHintSquare(getPossibleMoves(piece, board));
    }

    const drawHintSquare = (possibleMoves: string[]) => {
        setHintSquares(possibleMoves.map(square => board[square]?.type !== "king" &&
            <div key={square} className={styles.hint} style={{transform: squareToTranslate(square)}}></div>
        ));
    }

    const handleBoardClick = () => {
        setHighlightSquares([]);
        setHintSquares([]);
    }

    const handleMouseDown = (piece: Piece) => (event: React.MouseEvent) => {
        drawHintSquare(getPossibleMoves(piece, board));
    }

    const makeMove = (piece: Piece, position: string) => {
        console.log(piece);
        let possibleMoves = getPossibleMoves(piece, board);
        console.log(possibleMoves);
        if(possibleMoves.includes(position) && board[position]?.type !== "king") {
            let updatedBoard: any = board;
            updatedBoard[piece.position] = null;
            piece.position = position;
            piece.moveCount = piece.moveCount + 1;
            updatedBoard[position] = piece;
            setBoard({...updatedBoard});
            checkControl(piece);
        }
    }

    const checkControl = (piece: Piece) => {
        for(let p of Object.values(board)) {
            if(p === null || p.type === "king") continue;
            if(p.color === piece.color) {
                let possibleMoves = getPossibleMoves(p, board);
                for(let square of possibleMoves) {
                    if(board[square]?.type === "king") {
                        setCheckSquare(<div key={square} className={styles.check} style={{transform: squareToTranslate(square)}}></div>);
                        return;
                    }
                }
            }
        }
        setCheckSquare(null);
    }

    const squareToTranslate = (square: string) => {
        let column = (8 - (square[0].charCodeAt(0) - 96)) * 100;
        let row = (Number(square[1]) - 1) * 100;
        return `translate(${column}%, ${row}%)`;
    }

    const coordinatesToSquare = (clientX: number, clientY: number) => {
        let row = Math.floor(clientY / 100) + 1;
        let column = String.fromCharCode((7 - (Math.floor(clientX / 100)) + 97));
        return `${column}${row}`;
    }


    return(
        <div className="container">
            <div 
                className={styles.board} 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onContextMenu={handleContextMenu}
                onClick={handleBoardClick}>
                {Object.keys(board).map(square =>
                    board[square] && <div
                        key={square}
                        className={styles.piece} 
                        id={square}
                        style={{transform: squareToTranslate(board[square].position)}}
                        onDragStart={handleDragStart(board[square])}
                        onClick={handlePieceClick(board[square])}
                        onMouseDown={handleMouseDown(board[square])}>
                        <Image src={board[square].image} fill alt=""></Image>
                    </div>
                )}
                {highlightSquares}
                {hintSquares}
                {checkSquare}
            </div>
        </div>
    )
}