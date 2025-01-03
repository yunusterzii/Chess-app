"use client"

import styles from "./styles.module.css";
import { useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server"
import { getInitialBoard, squareToTranslate, coordinatesToSquare, createPiece } from "@/utils/utils";
import { getPossibleMoves, isCheck, getPieces } from "@/utils/move";
import { Piece, Board } from "../../../public/types/piece";
import Image from "next/image";

export default function BoardComponent() {
    const initialBoard: Board = getInitialBoard()
    const imageRef: any = useRef(null);
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const playTurn = useRef<string>("white");
    const [board, setBoard] = useState<Board>(initialBoard);
    const [hintSquares, setHintSquares]: any = useState([]);
    const [highlightSquares, setHighlightSquares]: any = useState([]);
    const [checkSquare, setCheckSquare]: any = useState(null);

    const handleDragStart = (piece: Piece | null) => (event: React.DragEvent<HTMLImageElement>) => {
        event.dataTransfer.setData('application/json', JSON.stringify(piece));
        // const ghost = <Image src={selectedPiece?.image} className={styles.ghost} alt="" fill></Image>;
        // const output = document.createElement('p');
        // const staticElement = renderToStaticMarkup(ghost);
        // output.innerHTML = staticElement;
        
        // output.style.background = 'red';
        // output.style.opacity = "1";
        // event.dataTransfer.setDragImage(output, 0, 0);
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
            setSelectedPiece(null);
        } 
    }

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        const square = coordinatesToSquare(event.clientX, event.clientY);
        if(highlightSquares.map((el: any) => el.key).includes(square)) return;
        setHighlightSquares([...highlightSquares, 
        <div key={square} className={styles.highlight} style={{transform: squareToTranslate(square)}}></div>])
    }

    const handleBoardClick = () => {
        setHighlightSquares([]);
    }

    const handleMouseDown = (piece: Piece | null) => (event: React.MouseEvent) => {
        if(piece?.color !== playTurn.current) return;
        if(event.button === 0) {
            if(selectedPiece === piece) {
                setHintSquares([]);
                setSelectedPiece(null);
                return;
            };
            setSelectedPiece(piece);
            drawHintSquare(getPossibleMoves(piece, board));
        }
    }

    const drawHintSquare = (possibleMoves: string[]) => {
        setHintSquares(possibleMoves.map(square => board[square]?.type !== "king" &&
            <div key={square} className={styles.hintSquare} style={{transform: squareToTranslate(square)}}>
                <div className={styles.hintDot}></div>
            </div>
        ));
    }

    const makeMove = (piece: Piece, position: string) => {
        let possibleMoves = getPossibleMoves(piece, board);
        if(!possibleMoves.includes(position) || board[position]?.type === "king" || piece.color !== playTurn.current) return;
        let updatedBoard: Board = board;
        if(piece.type === "king" && updatedBoard[position]?.type === "rook" && updatedBoard[position]?.color === piece.color) {
            handleCastle(piece, updatedBoard[position], updatedBoard);
        }
        else if(piece.type === "pawn" && (position[1] === "1" || position[1] === "8")) { 
            let queen = createPiece(position, "queen", piece.color);
            updatedBoard[position] = queen;
            updatedBoard[piece.position] = null;
            queen.moveCount = piece.moveCount + 1;
        }
        else {
            console.log("girdi");
            updatedBoard[piece.position] = null;
            updatedBoard[position] = piece;
            piece.position = position;
            piece.moveCount = piece.moveCount + 1;
        }
        setBoard({...updatedBoard});
        playTurn.current = playTurn.current === "white" ? "black" : "white";
        let color = piece.color === "white" ? "black" : "white";
        checkControl(color, board);
    }

    const handleCastle = (king: Piece, rook: Piece, board: Board) => {
        let positions: string[] = [];
        switch (rook.position) {
            case "a1":
                positions = ["b1", "c1"];
                break;
            case "h1":
                positions = ["f1", "e1"];
                break;
            case "a8":
                positions = ["b8", "c8"];
                break;
            case "h8":
                positions = ["f8", "e8"];
                break;
            default: 
                break;
        }

        board[rook.position] = null;
        rook.position = positions[1];
        rook.moveCount = rook.moveCount + 1;
        board[rook.position] = rook;

        board[king.position] = null;
        king.position = positions[0];
        king.moveCount = king.moveCount + 1;
        board[king.position] = king;
    }

    const checkControl = (color: string, board: Board) => {
        if (isCheck(board, color)) {
            let king = getPieces(board, color, "king")[0];
            setCheckSquare(<div key={king.position} className={styles.check} style={{transform: squareToTranslate(king.position)}}></div>);
            return;
        }
        setCheckSquare(null);
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
                        onMouseDown={handleMouseDown(board[square])}>
                        <Image src={board[square].image} fill alt=""></Image>
                    </div>
                )}
                {highlightSquares}
                {hintSquares}
                {checkSquare}
                {selectedPiece && <div className={styles.selectedPiece} style={{transform: squareToTranslate(selectedPiece.position)}}></div>}
            </div>
        </div>
    )
}