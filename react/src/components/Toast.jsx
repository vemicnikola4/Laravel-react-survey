import { useStateContext } from "../contexts/ContextProvider";


const Toast = ()=>{

    const {toast,setToast} = useStateContext();

    return(
        <>
            {
            toast.show && <div className="py-2 px-3 text-white rounded bg-emerald-500 fixed left-4 bottom-2 z-50 animate-fade-in-down">
                {toast.message}
            </div>
        }
        </>
    
    )
}

export default Toast;