import React from 'react'
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { PageUnderConstruction } from '../../../UnderConstructionPage/ConstructionPage'
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AccountsInvoicePage = () => {

    const navigate = useNavigate();
    return (
        <StaffJobLandingLayout
            accountView={true}
            hideSearchBar={true}
        >
            <div className="att_title"><div className="back_icon" onClick={() => navigate(-1)}><IoChevronBack /></div><h3>Invoice</h3></div>
            <PageUnderConstruction />
        </StaffJobLandingLayout>
    )
}

export default AccountsInvoicePage;