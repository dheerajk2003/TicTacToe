import { useEffect, useState } from "react";

export default function Home() {
    const [isPready, setisPready] = useState<boolean>(false);
    const [clientId, setClientId] = useState<number | undefined>();
    const [roomId, setRoomId] = useState<string>("");
    const [ttt, setTtt] = useState<number[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [heading1, setHeading1] = useState<string>("");
    const [myTurn, setMyTurn] = useState<boolean>(false);

    function Winner(num1:number,num2:number,num3:number){
        if(ttt[num2] == ttt[num1] && ttt[num2] == ttt[num3] && ttt[num1] != undefined && ttt[num1] != null){
            if(ttt[num1] == clientId){
                setHeading1("You Win");
            }
            else{
                setHeading1("You Lose");
            }
            setTtt([]);
            socket?.send(JSON.stringify({ttt:[],roomId,clientId}));
            setMyTurn(false);
        }
    }

    function OverCheck(){
        console.log("inside go");
        let isFull = true;
        if(ttt.length <= 0){
            isFull = false;
        }
        for (let i = 0; i < ttt.length; i++) {
            if (ttt[i] == null || ttt[i] == undefined) {
                isFull = false;
                break;
            }
        }
        if(isFull)
        {
            setHeading1("Game Over");
            setTtt([]);
            socket?.send(JSON.stringify({ttt:[],roomId,clientId}));
            setMyTurn(false);
        }
    }

    function WinnerCheck(){
        Winner(0,1,2);
        Winner(3,4,5);
        Winner(6,7,8);
        Winner(0,3,6);
        Winner(1,4,7);
        Winner(2,5,8);
        Winner(0,4,8);
        Winner(2,4,6);
        OverCheck();
    }

    useEffect(() => {
        WinnerCheck();
        console.log(myTurn);
    }, [ttt, myTurn]);

    if(socket){
        socket.addEventListener("error", (event) => {
            console.log(event);
        })
        socket.addEventListener('open',() => {
            socket.send(JSON.stringify({ttt,roomId,clientId}));
        })
        socket.addEventListener("message", (message) => {
            try{
                if(message){
                    const res = message.data;
                    console.log(`data = ${res}`);
                    const data = JSON.parse(res);
                    if(data){
                        setTtt(data.ttt);
                    }
                    setMyTurn(true);
                }
            }
            catch(error){
                console.log("error = " + error);
            }
        })
    }

    function createRoom() {
        if (roomId.length >= 10) {
            const newSocket = new WebSocket(`ws://localhost:4000/${roomId}`);
            setSocket(newSocket);
            setClientId(0);
            setisPready(true);
            socket?.send(JSON.stringify({ ttt, roomId, clientId }));
            setMyTurn(false);
        }
        else {
            alert("Room ID should be at least 10 characters");
        }
    }

    function joinRoom() {
        if (roomId.length >= 10) {
            const newSocket = new WebSocket(`ws://localhost:4000/${roomId}`);
            setSocket(newSocket);
            setClientId(1);
            setisPready(true);
            socket?.send(JSON.stringify({ ttt, roomId, clientId }));
            setMyTurn(false);
        } else {
            alert("Room ID should be at least 10 characters");
        }
    }

    function setValues(index: number) {
        if(!ttt[index] && myTurn){
            setTtt((prevData) => {
                const data = [...prevData];
                data[index] = clientId!;
                socket?.send(JSON.stringify({ttt: data,roomId,clientId}))

                return data;
            });
            setMyTurn(false);
            WinnerCheck();
            
        }
    }

    return (
        <div>
            <h1>{heading1}</h1>
            {!isPready && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        autoFocus={true}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button onClick={createRoom}>Create Room</button>
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            )}
            {isPready && (
                <>
                <div className="box" id="box">
                    <button className="btn" onClick={() => setValues(0)}>{(ttt[0] == 0) ? "O" : "" }{(ttt[0] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(1)}>{(ttt[1] == 0) ? "O" : "" }{(ttt[1] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(2)}>{(ttt[2] == 0) ? "O" : "" }{(ttt[2] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(3)}>{(ttt[3] == 0) ? "O" : "" }{(ttt[3] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(4)}>{(ttt[4] == 0) ? "O" : "" }{(ttt[4] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(5)}>{(ttt[5] == 0) ? "O" : "" }{(ttt[5] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(6)}>{(ttt[6] == 0) ? "O" : "" }{(ttt[6] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(7)}>{(ttt[7] == 0) ? "O" : "" }{(ttt[7] == 1) ? "X" : "" }</button>
                    <button className="btn" onClick={() => setValues(8)}>{(ttt[8] == 0) ? "O" : "" }{(ttt[8] == 1) ? "X" : "" }</button>
                </div>
                <h3>{`Turn = ${myTurn} ${clientId == 0 ? "O" : "X"}`}</h3>
                </>
            )}
        </div>
    );
}
