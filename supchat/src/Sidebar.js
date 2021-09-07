import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { Avatar, IconButton } from "@material-ui/core"
import { DonutLarge } from '@material-ui/icons'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SidebarChats from './SidebarChats';
import db from "./firebase"
import firebase from 'firebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateValue } from "./StateProvider"

export default function Sidebar({ id }) {
    const [rooms, setRooms] = useState([])
    const [{ user }] = useStateValue()
    const [chanel, setChanel] = useState('')
    //  console.log(user)
    // function to create a chat room
    const createNewChat = () => {
        const chatname = prompt("Enter Room Name")
        if (chatname) {
            db.collection('Rooms').add({
                chatname: chatname
            }).catch((e) => toast.error(e.message))
            toast.success("Chat Successfully Created ")
        }
    }

    //hook to fetch data from our cloud database
    useEffect(() => {
        const sub = db.collection('Rooms').onSnapshot(snap => {
            setRooms(snap.docs.map(doc => ({
                chatname: doc.data(),
                id: doc.id
            })))
        })
        return () => {
            sub()
        }

    }, [id])


    // method to filter message channels
    const filterChannels = (e) => {
        e.preventDefault()
        let value = e.target.value.toLowerCase()
        let result = []
        result = rooms.filter((res) => {
            return res.chatname.chatname.toLowerCase().search(value) != -1;
        })

        setRooms(result)
    }

    //refresh rooms
    const refresh = () => {
        const sub = db.collection('Rooms').onSnapshot(snap => {
            setRooms(snap.docs.map(doc => ({
                chatname: doc.data(),
                id: doc.id
            })))
        })
        return () => {
            sub()
        }
    }
    return (
        <div className="side-bar">
            <ToastContainer />
            <div className="sidebar-header">
                <Avatar src={user?.photoURL} className="top-avatar" />
                <div className="header-right">
                    <IconButton onClick={refresh}>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar-search">
                <div className="search-container">
                    <SearchIcon />
                    <input onChange={filterChannels} />
                </div>
            </div>
            <div onClick={createNewChat} className="chat-head">
                <h2>New Chat</h2>
            </div>
            /* create a div here and give it a class name of sidebar-chats */
            <div className="sidebar-chats">
                {
                    rooms.map(room => (
                        <SidebarChats key={room.id} id={room.id} chatname={room?.chatname.chatname} />
                    ))
                }


            </div>
        </div>
    )
}