import logo from './logo.svg';
import './App.css';
import abi from './abi.json';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import swal from 'sweetalert';
const {ethereum} = window;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [account, setAccount] = useState("");


  const checkWallet = async() => {
    try {
      if(!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({method: 'eth_accounts'});
      if(accounts.length){
        setCurrentAccount(accounts[0]);
        setAccount(accounts[0]);
        console.log(account);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async() => {
    try {
      if(!ethereum) return alert("Please install metamask");
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const addVehicles = async(event) => {
    event.preventDefault();
    let _name = event.target._name.value;
    let _number = event.target._number.value;
    let _address = event.target._address.value;
    let _model = event.target._model.value;
    let _soldDate = event.target._soldDate.value;
    console.log(_name, _number, _address, _model, _soldDate);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const vehicleContract = new ethers.Contract("0x95187D21DF3aA3b05EC033f6E7f3D083ed5faDE4",abi,signer);
    const addVehicle = await vehicleContract.addVehicle(_name, _number, _address, _model, _soldDate);
    setIsLoading(true);
    await addVehicle.wait();
    setIsLoading(false);
    swal("Vehicle Successfully added","The vehicle is Successfully added","success");
  }

  const getAllVehicles = async(event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const vehicleContract = new ethers.Contract("0x95187D21DF3aA3b05EC033f6E7f3D083ed5faDE4",abi,signer);

    const vehicles = await vehicleContract.getVehicles();
    setVehicles(vehicles);
  }

  useEffect(()=>{
    checkWallet();
  },[])

  return (
    <div className='mh-100 m-auto'>
      <h1 className='text-primary text-center mb-4 fw-bold bg-body-secondary p-2 shadow-sm rounded-bottom'>Vehicle Record Management System</h1>

    {
      account=="0xbaf76013d21b94bfb850133b6a62601fa8e2ca1a" ?  <form onSubmit={addVehicles} className='w-25 mx-auto shadow-sm p-5 bg-white rounded mb-5'>
      <input className='form-control mb-2' type="text" name='_name' placeholder='Enter Vehicle Buyer name' />
      <input className='form-control mb-2' type="text" name='_number' placeholder='Enter Buyers Number' />
      <input className='form-control mb-2' type="text" name='_address' placeholder='Enter Buyer Address' />
      <input className='form-control mb-2' type="text" name='_model' placeholder='Enter Vehicle Model' />
      <input className='form-control mb-4' type="date" name='_soldDate' placeholder='Enter Sold Date' />
      <button className='btn btn-primary w-100'>Add Vehicle</button>
    </form> : null
    }
     

      {
        isLoading ? <div className='d-flex justify-content-center m-3'>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
           </div>
        </div> : null
      } <br />

    
    <form onSubmit={getAllVehicles} className="d-flex justify-content-center mb-3">
      <button className='btn btn-danger' type='submit'>Get All Records</button>
    </form>
      <table className='table table-striped w-50 mx-auto bg-body-tertiary rounded text-center'>
        <thead>
        <tr scope="col">
            <th>Buyer Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Vehicle Model</th>
            <th>Sold Date</th>
        </tr>
        </thead>
        {
          <tbody>
            {
              vehicles?.map(vehicle => <tr>
                <td>{vehicle.ownerName}</td>
                <td>{vehicle.ownerNumber}</td>
                <td>{vehicle.ownerAddress}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.soldDate}</td>
              </tr>)
            }
          </tbody>
        }
      </table>

      <div className='d-flex justify-content-center'>
        {
          !currentAccount ? <button className='btn btn-warning' onClick={connectWallet}>Connect Wallet</button> : null
        }
      </div>
    </div>
  );
}

export default App;
