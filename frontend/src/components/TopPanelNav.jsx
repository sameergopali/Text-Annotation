import { useNavigate } from "react-router-dom";

import home from '../assets/images/home.png';
import text_annot from '../assets/images/text_annot.png';
import ysom from '../assets/images/Yale_School_of_Medicine.png';
import yale from '../assets/images/Yale.png'



const TopPanelNav = function({children}){
    const navigate=useNavigate();
    return (
        <div className="top-panel">
            <img src={home} alt="home_logo" width="40px" onClick={()=>{navigate('/dashboard')}}/> 
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<img src={text_annot} alt="text_annot" width="2%"/>&nbsp;&nbsp;
            <img src={ysom} alt="ysom" width="1.5%"/>&nbsp;&nbsp;
            <img src={yale} alt="yale" width="2%"/>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            {children}
        </div>
        );
}

export default TopPanelNav;