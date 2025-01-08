import home from '../assets/images/home.png';
import text_annot from '../assets/images/text_annot.png';
import ysom from '../assets/images/Yale_School_of_Medicine.png';
import yale from '../assets/images/Yale.png'

const TopPanelNav = function({children}){
    return (
        <div className="top-panel">
            <a href="/dashboard"><img src={home} alt="home_logo" width="40px"/></a>   
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<img src={text_annot} alt="text_annot" width="2%"/>&nbsp;&nbsp;
            <img src={ysom} alt="ysom" width="1.5%"/>&nbsp;&nbsp;
            <img src={yale} alt="yale" width="2%"/>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            {children}
        </div>
        );
}

export default TopPanelNav;