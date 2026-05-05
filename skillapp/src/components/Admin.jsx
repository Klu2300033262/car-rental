import React, { useState } from 'react'
import api from '../api'
import './style.css'

export default function Admin() {

    const[electronics, setElectronics] = useState(null)
    const[vegetables, setVegetables] = useState(null)
    const[grocessories, setGrocessories] = useState(null)

    if(electronics == null){
        api.get("/electronics", {}).then((res)=>{
            console.log(res.data)
            setElectronics(res.data)
        })
    }

    if(vegetables == null){
        api.get("/vegetables", {}).then((res)=>{
            console.log(res.data)
            setVegetables(res.data)
        })
    }

    if(grocessories == null){
        api.get("/grossories", {}).then((res)=>{
            console.log(res.data)
            setGrocessories(res.data)
        })
    }

    function insertData(){
        var pid = parseInt(document.getElementsByName("pid")[0].value);
        var pcost = parseInt(document.getElementsByName("pcost")[0].value);
        var pimage = document.getElementsByName("pimage")[0].value;
        var pname = document.getElementsByName("pname")[0].value;
        var pqty = parseInt(document.getElementsByName("pqty")[0].value);
        var pcat = document.getElementsByName("pcat")[0].value;

        api.post(`/product/${pcat}`, {
            "pid": pid,
            "pcost": pcost,
            "pimage": pimage,
            "pname": pname,
            "pqty": pqty
        }).then((res)=>{
            alert(res.data)
            if(res.data == "Inserted Suuessfully"){
                setElectronics(null)
                setGrocessories(null)
                setVegetables(null)
            }
        })
    }

    function editData(element){
        document.getElementsByName("pid")[0].value = element.pid;
        document.getElementsByName("pcost")[0].value = element.pcost;
        document.getElementsByName("pimage")[0].value = element.pimage;
        document.getElementsByName("pname")[0].value = element.pname;
        document.getElementsByName("pqty")[0].value = element.pqty;
    }

    function updateData(){
        var pid = parseInt(document.getElementsByName("pid")[0].value);
        var pcost = parseInt(document.getElementsByName("pcost")[0].value);
        var pimage = document.getElementsByName("pimage")[0].value;
        var pname = document.getElementsByName("pname")[0].value;
        var pqty = parseInt(document.getElementsByName("pqty")[0].value);
        var pcat = document.getElementsByName("pcat")[0].value;

        api.put(`/product/${pcat}`, {
            "pid": pid,
            "pcost": pcost,
            "pimage": pimage,
            "pname": pname,
            "pqty": pqty
        }).then((res)=>{
            alert(res.data)
            if(res.data == "Updated"){
                setElectronics(null)
                setGrocessories(null)
                setVegetables(null)
            }
        })
    }

    function deleteData(element, pcat){
        if(confirm(`Do you want to delete ${element.pid}`))
        {
            api.delete(`/product/${pcat}`, {
                params:{"pid": parseInt(element.pid)}
            }).then((res)=>{
                alert(res.data)
                if(res.data == "Deleted"){
                    setElectronics(null)
                    setGrocessories(null)
                    setVegetables(null)
                }
            })
        }
    }

  return (
    <>
    <div className='login-form'>
      <table>
        <tr style={{ textAlign: 'center', backgroundColor: 'var(--accent)', color: 'white'}}>
            <td colSpan={2}> Vehicle Inventory Management </td>
        </tr>
        <tr>
            <td> PID </td>
            <td> <input type='text' name='pid' className="form-control" /> </td>
        </tr>
        <tr>
            <td> PCOST </td>
            <td> <input type='text' name='pcost' className="form-control" /> </td>
        </tr>
        <tr>
            <td> PIMAGE </td>
            <td> <input type='text' name='pimage' className="form-control" /> </td>
        </tr>
        <tr>
            <td> PNAME </td>
            <td> <input type='text' name='pname' className="form-control" /> </td>
        </tr>
        <tr>
            <td> PQUANTITY </td>
            <td> <input type='text' name='pqty' className="form-control" /> </td>
        </tr>
        <tr>
            <td> Category </td>
            <td> <select name='pcat' className="form-select">
                <option value={"e"}> Primary Fleet (e) </option>
                <option value={"g"}> Economy Fleet (g) </option>
                <option value={"v"}> SUV Fleet (v) </option> 
            </select> </td>
        </tr>
        <tr style={{ textAlign: 'center' }}>
            <td colSpan={1}> <button onClick={insertData} style={{ backgroundColor: "yellowgreen" }}> Insert Data </button> </td>
            <td colSpan={1}> <button onClick={updateData} style={{ backgroundColor: "yellowgreen" }}> Update Data </button> </td>
        </tr>
      </table>
    </div>

    <br/><br/>

    <div className='login-form' style={{ width:"auto" }}>
        {electronics==null ? <p> Electronics Data Fetching </p> : 
        <table>
            <tr style={{ textAlign: 'center', backgroundColor: 'skyblue'}}>
                <td colSpan={7}> Primary Fleet (Luxury) </td>
            </tr>
            <tr>
                <th>PID</th>
                <th>MODEL NAME</th>
                <th>RENT COST</th>
                <th>INVENTORY QTY</th>
                <th>IMAGE URL</th>
                <th>EDIT</th>
                <th>DELETE</th>
            </tr>
            {electronics.map((element)=>{
                return(
                    <tr>
                        <td> {element.pid} </td>
                        <td> {element.pname} </td>
                        <td> {element.pcost} </td>
                        <td> {element.pqty} </td>
                        <td> {element.pimage} </td>
                        <td> <button onClick={()=>{editData(element)}} style={{ backgroundColor: "yellowgreen" }}> EDIT </button> </td>
                        <td> <button onClick={()=>{deleteData(element, "e")}} style={{ backgroundColor: "yellowgreen" }}> DELETE </button> </td>
                    </tr>
                )
            })} 
        </table>
        }
        
        <br/><br/>

        {vegetables==null ? <p> Vegetables Data Fetching </p> : 
        <table>
            <tr style={{ textAlign: 'center', backgroundColor: 'skyblue'}}>
                <td colSpan={7}> SUV & Off-Road Fleet </td>
            </tr>
            <tr>
                <th>PID</th>
                <th>PNAME</th>
                <th>PCOST</th>
                <th>PQUANTITY</th>
                <th>PIMAGE</th>
                <th>EDIT</th>
                <th>DELETE</th>
            </tr>
            {vegetables.map((element)=>{
                return(
                    <tr>
                        <td> {element.pid} </td>
                        <td> {element.pname} </td>
                        <td> {element.pcost} </td>
                        <td> {element.pqty} </td>
                        <td> {element.pimage} </td>
                        <td> <button onClick={()=>{editData(element)}} style={{ backgroundColor: "yellowgreen" }}> EDIT </button> </td>
                        <td> <button onClick={()=>{deleteData(element, "v")}} style={{ backgroundColor: "yellowgreen" }}> DELETE </button> </td>
                    </tr>
                )
            })} 
        </table>
        }

        <br/><br/>

        {grocessories==null ? <p> Grocessories Data Fetching </p> : 
        <table>
            <tr style={{ textAlign: 'center', backgroundColor: 'skyblue'}}>
                <td colSpan={7}> Economy & Hatchback Fleet </td>
            </tr>
            <tr>
                <th>PID</th>
                <th>PNAME</th>
                <th>PCOST</th>
                <th>PQUANTITY</th>
                <th>PIMAGE</th>
                <th>EDIT</th>
                <th>DELETE</th>
            </tr>
            {grocessories.map((element)=>{
                return(
                    <tr>
                        <td> {element.pid} </td>
                        <td> {element.pname} </td>
                        <td> {element.pcost} </td>
                        <td> {element.pqty} </td>
                        <td> {element.pimage} </td>
                        <td> <button onClick={()=>{editData(element)}} style={{ backgroundColor: "yellowgreen" }}> EDIT </button> </td>
                        <td> <button onClick={()=>{deleteData(element, "g")}} style={{ backgroundColor: "yellowgreen" }}> DELETE </button> </td>
                    </tr>
                )
            })} 
        </table>
        }
    </div>
    </>
  )
}
