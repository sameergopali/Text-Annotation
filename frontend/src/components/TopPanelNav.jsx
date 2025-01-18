import { useNavigate } from "react-router-dom";

import home from '../assets/images/home.png';
import text_annot from '../assets/images/text_annot.png';
import ysom from '../assets/images/Yale_School_of_Medicine.png';
import yale from '../assets/images/Yale.png'



const TopPanelNav = function({children}){
    const navigate=useNavigate();
    return (
        <div className="flex items-center p-4 bg-green-400">
            <img src={home} alt="home_logo" className="w-10 cursor-pointer" onClick={() => { navigate('/dashboard') }} />
            <span className="mx-4">|</span>
            <img src={text_annot} alt="text_annot" className="w-8 mx-2" />
            <img src={ysom} alt="ysom" className="w-6 mx-2" />
            <img src={yale} alt="yale" className="w-8 mx-2" />
            <span className="mx-4">|</span>
            {children}
        </div>
    );
}

export default TopPanelNav;