import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToPaste, updateToPastes } from '../redux/pasteSlice';

const Home = () => {
    const [title,setTitle]=useState('');
    const[value,setValue]=useState('');
    const[searchParams,setSearchParams]=useSearchParams();
    const pasteId=searchParams.get("pasteId");
const dispatch=useDispatch();

function createPaste(){

    const paste={
        title:title,
        content:value,
        _id:pasteId || Date.now().toString(36),
        createdAt:new Date().toString(),
    }
    if(pasteId){
        //update
        dispatch(updateToPastes(paste));


    }
    else{
        dispatch(addToPaste(paste));
    }

    //after creation or updatation

    setTitle('');
    setValue('');
    setSearchParams({});

}

  return (
    <div>
        <div className='flex flex-row gap-7 place-content-between'>
      <input 
      className="p-1 pl-5 rounded-2xl mt-2 bg-black w-[50%]"

    type='text'
    placeholder='enter title here'
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
      />

      <button
      onClick={createPaste}
      className="p-2 rounded-2xl mt-2 bg-black">
       {
    pasteId?"Update My Paste":"Create My Paste"
    }
      </button>
    </div>
    <div className='mt-8'>
        <textarea 
        className='rounded-2xl mt-4 min-w-[500px] p-4'
       value={value}
       placeholder="write your note here"
       onChange={(e)=>setValue(e.target.value)}
    rows={20}

       />
    </div>
    </div>
  )
}

export default Home
