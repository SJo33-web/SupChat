import React, { useEffect, useState } from 'react'
import "./SidebarChats.css"
import { Avatar, IconButton } from "@material-ui/core"
import { Link } from "react-router-dom";
import db from "./firebase"
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';

export default function SidebarChats({ chatname, id }) {
    const [messages, setMessages] = useState([])


    //function to load messages fro each hnnel in the sidebar
    useEffect(() => {
        if (id) {
            db.collection('Rooms').doc(id).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snap => {
                setMessages(snap.docs.map(doc => doc.data()))
            })
        }
    }, [id])


    return (
        <Link to={`/rooms/${id}`} className="sidebar_link">
            <div className="chats">
                <Avatar className="avat" />
                <div className="chats-info">
                    <h2>{chatname}</h2>
                    {messages.length > 0 ? (
                        <p>{messages[0]?.text}</p>
                    ) : (
                        <p>No messages </p>
                    )}
                </div>
                <div>
                    {messages.length > 0 ? (
                        <Badge className="badge" color="secondary" badgeContent={messages.length} />
                    ) : (
                        <Badge className="badge" color="secondary" badgeContent="0" />
                    )
                    }

                </div>
            </div>
        </Link>

    )
}