import React,{useState} from 'react';
import useMediaQuery from '../useMedia';
import Topsongs from '../Home/topsong';
import Newrelease from '../Home/newrelease';
import Trending from '../Trendy/trending';
import Artist from '../Playlist/artist';
import Albums from '../Albumsongs/albums';



function Discover(){
    const isAboveMedium=useMediaQuery('(min-width:768px)');

return(
    <>
    {isAboveMedium ?(
     <div className='overflow-y-auto h-screen w-full mb-12' style={{ overflowX: "scroll", minWidth: "100%" }}>
   
     <div className="mb-8">
       <h1 className='text-3xl p-4 m-5'>Weekly Top <span className="text-red font-bold">Songs</span></h1>
       <Topsongs />
     </div>
     <div className="mb-8">
       <h1 className='text-3xl p-4 m-5'>New Releases <span className="text-red font-bold">Songs</span></h1>
       <Newrelease />
     </div>
     <div className="mb-8">
       <h1 className='text-3xl p-4 m-5'>Trending <span className="text-red font-bold">Songs</span></h1>
       <Trending />
     </div>
     <div className="mb-8">
       <h1 className='text-3xl p-4 m-5'>Popular <span className="text-red font-bold">Artists</span></h1>
       <Artist />
     </div>
     <div className="mb-8">
       <h1 className='text-3xl p-4 m-5'>Top <span className="text-red font-bold">Album</span></h1>
       <Albums />
     </div>
   </div>
   
    ):(
        <div className='overflow-y h-screen w-full' style={{overflowX:"scroll"}}>
    
        <h1 className='text-xl p-2 m-0'>Weekly Top <span className="text-red font-bold">Songs</span> </h1>

          <Topsongs/>
          <h1 className='text-xl p-2 m-0'>New Releases <span className="text-red font-bold">Songs</span></h1>
       <Newrelease/>
       <h1 className='text-xl p-2 m-0'>Trending <span className="text-red font-bold">Songs</span></h1>
       <Topsongs names={"trending songs 2024"}/>
       <h1 className='text-xl p-2 m-0'>Popular<span className="text-red font-bold">Artists</span></h1>
       <Artist/>
       <h1 className='text-xl p-2 m-0'>Popular<span className="text-red font-bold">Albums</span></h1>
       <Albums/>
       <div className='h-2/6'>

       </div>
        </div>
    )
}
    </>
)
}
export default Discover;