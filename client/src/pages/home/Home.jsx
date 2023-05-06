import './home.css';
import Navbar from '../../components/navbar/Navbar';
import LeftFeed from '../../components/leftFeed/LeftFeed';
import Feed from '../../components/feed/Feed';
import RightFeed from '../../components/rightFeed/RightFeed';
import RecordAudio from '../../components/recordAudio/RecordAudio';


const Home = () => {
  return (
    <div className='home-container'>
      <div className="container">
        <RecordAudio />
      </div>
    </div>

  )
}
export default Home;