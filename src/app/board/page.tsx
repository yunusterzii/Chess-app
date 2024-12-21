"use client"

import styles from "./styles.module.css";
import { useRef, useState } from "react";
import { getInitialBoard, createPiece } from "@/utils/utils";
import { getPossibleMoves } from "@/utils/move";
import { Piece } from "../../../public/types/piece";
import Image from "next/image";

export default function Board() {
    const initialBoard = getInitialBoard()
    const [board, setBoard]: any = useState(initialBoard);
    const [hintSquares, setHintSquares]: any = useState([]);
    const [highlightSquares, setHighlightSquares]: any = useState([]);

    const handleDragStart = (piece: Piece) => (event: React.DragEvent<HTMLImageElement>) => {
        setHintSquares(getPossibleMoves(piece, board).map(square => 
            <div key={square} className={styles.hint} style={{transform: squareToTranslate(square)}}></div>
        ))
        event.dataTransfer.setData('application/json', JSON.stringify(piece));
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

    const handleDragOver = (event: React.DragEvent<HTMLImageElement>) => {
        event.preventDefault();
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
        // console.log(getPossibleMoves(piece, board));
        // console.log(hintSquares.map((el: any) => el.key));
        // if(getPossibleMoves(piece, board) === hintSquares.map((el: any) => el.key)) {
        //     console.log("girdi");
        //     setHintSquares([]);
        //     return;
        // }

        setHintSquares(getPossibleMoves(piece, board).map(square => 
            <div key={square} className={styles.hint} style={{transform: squareToTranslate(square)}}></div>
        ))
    }

    const handleBoardClick = () => {
        setHighlightSquares([]);
        setHintSquares([]);
    }

    const makeMove = (piece: Piece, position: string) => {
        console.log(piece);
        let possibleMoves = getPossibleMoves(piece, board);
        console.log(possibleMoves);
        if(possibleMoves.includes(position)) {
            let updatedBoard: any = board;
            updatedBoard[piece.position] = null;
            piece.position = position;
            piece.moveCount = piece.moveCount + 1;
            updatedBoard[position] = piece;
            setBoard({...updatedBoard});
        }
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

    const test = () => {
        let piece = createPiece("d5", "pawn", "black");
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
                        onClick={handlePieceClick(board[square])}>
                        <Image src={board[square].image} fill alt=""></Image>
                    </div>
                )}
                {highlightSquares}
                {hintSquares}
            </div>
            <button onClick={test}>click</button>
        </div>
    )
}