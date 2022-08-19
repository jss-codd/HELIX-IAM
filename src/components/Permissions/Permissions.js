import axios from 'axios';
import React, { useEffect, useState } from 'react';
import keycloakApi, { REACT_APP_KEYCLOAK_URL } from '../../apiCall';
import './Permission.css';



const Permissions = () => {
    const [keyclockGroup, setkeyclockGroup] = useState([])
    const [allGroups, setAllGroups] = useState([])
    const [roleList, setRoleList] = useState([])

    useEffect(() => {
        getAllGroups()

    }, [])

    const getAllGroups = async () => {
        const res = await keycloakApi("/groups")
        let group = await res.data.filter(d => { if (d.name != "Admin") return true })
        for (let i = 0; i < group.length; i++) {
            let res_data = await keycloakApi(`/groups/${group[i].id}`)
            group[i]["roles"] = res_data?.data?.realmRoles
        }
        setkeyclockGroup(group)
        setAllGroups(group)
        getRoles(group)


    }

    const getRoles = async (group) => {
        let res = await keycloakApi.get(`/roles`)
        let tablelist = res.data.map((dta) => {
            let d_Obj = {}
            group.map(d => {
                d_Obj[`${d.name}`] = d.roles.includes(dta.name)
                d_Obj["group_id"] = d.id
            })
            let dat = {}
            dat[`${dta.name}`] = d_Obj
            return { ...dta, checkValues: dat }

        })
        setRoleList(tablelist)
    }

    const handleChecked = async (dta, group, e) => {

        try {

            const sendData = [{
                attributes: {},
                clientRole: false,
                composite: false,
                containerId: dta.containerId,
                id: dta.id,
                name: dta.name
            }]

            if (e.target.checked) {
                const res = await keycloakApi.post(`groups/${group}/role-mappings/realm`, sendData)
                getAllGroups()
            }
            else {
                const accessToken = localStorage.getItem("accessToken");

                let res = await axios.delete(`${process.env.REACT_APP_KEYCLOAK_URL}/groups/${group}/role-mappings/realm`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',

                    },
                    data: sendData,
                })
                getAllGroups()

            }

        } catch (error) {
            console.log(error);

        }


    }






    return (
        <div className='perm_maindiv' >
            <h3> Permission </h3>

            <form  >
                <table className="table table-bordered" >
                    <thead style={{ background: "#3a4354", color: "#fff", border: "1px sold white" }} >
                        <tr>
                            <th scope="col">Permissions</th>
                            {keyclockGroup.map((d, i) => {
                                return (<th key={i} scope="col">{d.name}</th>)
                            })}
                        </tr>
                    </thead>
                    <tbody style={{ border: "1px solid black" }} >

                        {roleList.map((dta, idx) => {
                            let keyi = Object.keys(dta?.checkValues)
                            let Value = Object.values(dta.checkValues)
                            return (
                                <tr key={idx}>
                                    <th scope="row">{keyi[0]}</th>
                                    {allGroups.map((d, i) => {
                                        return (
                                            <td key={i} ><div className="form-check">
                                                <input className="form-check-input" type="checkbox" checked={Value[0][d.name]} onChange={(e) => handleChecked(dta, d.id, e)} id="flexCheckIndeterminate" />

                                            </div></td>
                                        )

                                    })}

                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </form>























        </div>
    )
}

export default Permissions