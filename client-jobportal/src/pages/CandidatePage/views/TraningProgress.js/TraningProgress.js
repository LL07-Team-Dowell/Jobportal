import React from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import styled from 'styled-components';
import * as assets from '../../../../assets/assetsIndex';
import { useNavigate } from 'react-router-dom';

function TraningProgress() {
    const Wrapper = styled.div`
        font-family:'poppins';
        background-color:#F5F5F5;
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    `

    const Section_1 = styled.div`
        border-bottom: 1px solid gray;
        font-family:'poppins';
    `

    const Navbar = styled.nav`
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F0F0F0;
        padding: 0 16px;
        height: 10vh;
        background-color: white;
    `;

    const NavbarItem = styled.div`
        .item {
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: relative;

            img{
                width: 120px;
                height: 120px;
                padding: 10px;
            }

            h1{
                color:#005734;
            }

            input{
                padding: 15px 37px;
                width: 500px;
                background-color: #F5F5F5;
                border: none;
            }

            svg.svg {
                max-width: 100%;
                font-size: 20px;
                position: absolute;
                left: 10px;
            }

            svg{
                font-size: 25px;
            }

            .home{
                width: 100px;
                text-align: center;
                color: #7E7E7E;
                p{
                    font-size: 15px;
                }
            }

            .tranning{
                width: 100px;
                text-align: center;
                color: #7E7E7E;
                p{
                    font-size: 15px;
                }
            }
        }
    `;

    const Section_2 = styled.div`
        padding: 50px;
        background-color:  #F5F5F5;
        position: relative;

        .left-content{
                display: flex;
                align-items: center;            
            img {
                height: 90px;
                width: 90px;
                border-radius: 60px;
            }

            .title{
                padding: 10px 10px;
                h2{
                    font-weight: 500;
                }
                h3{
                    font-weight: 400;
                    font-size: 20px;
                }
            }
        }

        .bar-bottom {
            display: flex;
            position: absolute;
            bottom: 3px;
            left: 80px;

            .progress {
                margin-right: 15px;
                border-bottom: 3px solid #005734;
                color: #005734;
            }

            .completed{
                color: #A3A1A1;
            }

            h5 {
                font-weight: 400;
            }
        }
    `

    const Section_3 = styled.div`
        padding: 50px;
        position: relative;

        .traning_section {
            display: flex;
            align-items: center;
            .right-content{
                padding: 0 30px;
                span {
                    font-weight: 300;
                    font-size: 13px;
                    color: #7E7E7E;
                }
                h6 {
                    font-size: 1.2rem;
                    font-weight: 500;
                }
                .content{
                    display: flex;
                    align-items: center;
                    img{
                        height:50px;
                        width:50px;
                    }
                    span{
                        font-size: 13px;
                        color: #7E7E7E;
                        margin-left: 5px;
                    }
                }
            }

            .left-content{
                img{
                    width: 250px;
                    height: 170px;
                }
            }


            .bottom-content {
                position: absolute;
                right: 3rem;
                bottom: 3rem;
                color: #038953;
                font-size: 1rem;
                border: 1px solid #038953;
                padding: 6px 20px;
                cursor: pointer;
            }
        }
    `
    const nevigate = useNavigate();
    const nevigateButton = () => {
        nevigate(-1);
    }

    return (
        <>
            <Section_1>
                <Navbar>
                    <NavbarItem>
                        <div className="item">
                            <IoIosArrowBack onClick={nevigateButton} />
                            <h1>My Training</h1>
                        </div>
                    </NavbarItem>
                </Navbar>
            </Section_1>
            <Wrapper>
                <Section_2>
                    <div className="left-content">
                        <img src={assets.dev_img} alt="dev" />
                        <div className="title">
                            <h2>Welcome back, George!</h2>
                            <h3>Front-end Developer</h3>
                        </div>
                    </div>
                    <div className="right-content">

                    </div>
                    <div className="bar-bottom">
                        <div className="progress">
                            <h5>In Progress</h5>
                        </div>
                        <div className="completed">
                            <h5>Completed</h5>
                        </div>
                    </div>
                </Section_2>

                <Section_3>
                    <div className="traning_section">
                        <div className="left-content">
                            <img src={assets.frontendimage} alt="frontend" />
                        </div>
                        <div className="right-content">
                            <span>Training Program</span>
                            <h6>Become a Front-end Developer</h6>
                            <div className="content">
                                <img src={assets.logo_img} alt="logo" />
                                <span>Training</span>
                                <span>Apr 2023</span>
                            </div>
                        </div>
                        <div className="bottom-content">
                            Start Now
                        </div>
                    </div>
                </Section_3>
            </Wrapper>
        </>

    )
}

export default TraningProgress;
