import { DeLabAddress, DeLabConnect } from '@delab-team/connect';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  InputGroup,
  ListGroup,
  Button,
  Modal,
} from 'react-bootstrap';
import { fixAmount, smlAddr } from '../logic/utils';
import { AccountV2 } from '../logic/tonapi';

interface HeaderType {
  openModalConnect: Function;
  address: DeLabAddress;
  DelabObject: DeLabConnect;
  balance: string | undefined;
  account: AccountV2 | undefined;
}

export const HeaderBlock: React.FC<HeaderType> = (props: HeaderType) => {
  const [firstRender, setFirstRender] = React.useState<boolean>(false);

  console.log('🚀 ~ file: header.tsx:26 ~ account:', props.account);
  const location = useLocation();
  const history = useNavigate();

  useEffect(() => {
    if (!firstRender) {
      setFirstRender(true);
    }
  }, []);

  return (
    <header className="header">
      <Container fluid>
        <Navbar expand="lg" className="d-flex align-items-center p-0">
          <Navbar.Brand
            className="navbar-logo me-5"
            onClick={() => history('/')}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="navbar-logo__img"
              src="./assets/img/logo/apple-icon-57x57.png"
              alt="Libermall - NFT Marketplace"
            />
            <span className="navbar-logo__name d-none d-xxl-block">Libermall</span>
          </Navbar.Brand>
          {!props.address ? (
            <Button
              variant="secondary btn-mobile-header d-block d-lg-none ms-auto"
              // data-bs-toggle="modal"
              // data-bs-target="#ConnectModal"
              onClick={() => props.DelabObject.openModal()}
            >
              <i className="fa-solid fa-wallet me-2" />
              Connect
            </Button>
          ) : (
            <div className="dropdown ms-auto d-block d-lg-none">
              <Button
                id="dropdownMenuProfile"
                variant="none p-0 border-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={props.account?.icon ? props.account.icon : './assets/img/no-user-pic.png'}
                  alt=""
                  className="profile-image"
                  width="42"
                  height="42"
                />
              </Button>
              <ul
                className="dropdown-menu-list dropdown-menu me-0 end-0 mobile-header-dropdown"
                aria-labelledby="dropdownMenuProfile"
              >
                <a className="dropdown-item py-3 px-2" href={`/user?a=${props.address ?? ''}`}>
                  <div className="d-flex align-items-center ps-2">
                    <img
                      src={
                        props.account?.icon ? props.account.icon : './assets/img/no-user-pic.png'
                      }
                      alt=""
                      className="profile-image me-3"
                      width="42"
                      height="42"
                    />
                    <div className="__body">
                      <div className="mb-2 text-white fw-medium fs-16">
                        {smlAddr(props.address ?? '')}
                      </div>
                      <div className="small d-flex align-items-center">
                        <span className="icon-ton me-1" /> {fixAmount(props.balance ?? '0')} TON
                        {/* <span className="color-grey ms-1">~ 0.56$</span> */}
                      </div>
                    </div>
                  </div>
                </a>
                <a className="dropdown-item dropdown-menu-list-item" href="/create-nft">
                  <i className="fa-regular fa-hexagon-vertical-nft me-3 dropdown-menu-list-icon" />
                  Create NFT
                </a>
                <a
                  className="dropdown-item dropdown-menu-list-item border-0"
                  href={`/user?a=${props.address ?? ''}`}
                  onClick={() => props.DelabObject.disconnect()}
                >
                  <i className="fa-regular fa-link-simple-slash me-3 dropdown-menu-list-icon" />{' '}
                  Disconnect{' '}
                </a>
              </ul>
            </div>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="order-2 order-xl-1 ms-3">
            <span />
            <span />
            <span />
          </Navbar.Toggle>
          <Navbar.Collapse id="MenuHeader">
            <NavDropdown
              id="dropdownMenuSearch"
              className="header__search flex-fill mx-0 mx-lg-3 mx-xl-5 mb-3 mb-lg-0 order-1 order-lg-2"
              title={
                <Form>
                  <InputGroup>
                    <Form.Control type="search" placeholder="Search" aria-label="Search" />
                    <InputGroup.Text className="p-0">
                      <Button variant="link p-3">
                        <i className="fa-solid fa-magnifying-glass color-grey" />
                      </Button>
                    </InputGroup.Text>
                  </InputGroup>
                </Form>
              }
            >
              <NavDropdown.Item href="/collection" className="d-flex align-items-center w-100">
                <img
                  src="./assets/img/collections/1.gif"
                  className="rounded"
                  width="48"
                  height="48"
                />
                <div className="card-title fs-16 ms-3">Animals Red List</div>
                <i className="fa-solid fa-angle-right ms-auto" />
              </NavDropdown.Item>
              <NavDropdown.Item href="/collection" className="d-flex align-items-center w-100">
                <img
                  src="./assets/img/collections/2.gif"
                  className="rounded"
                  width="48"
                  height="48"
                />
                <div className="card-title fs-16 ms-3">Rich Cats</div>
                <i className="fa-solid fa-angle-right ms-auto" />
              </NavDropdown.Item>
              <NavDropdown.Item href="/collection" className="d-flex align-items-center w-100">
                <img
                  src="./assets/img/collections/4.gif"
                  className="rounded"
                  width="48"
                  height="48"
                />
                <div className="card-title fs-16 ms-3">TON DOODLES</div>
                <i className="fa-solid fa-angle-right ms-auto" />
              </NavDropdown.Item>
            </NavDropdown>
            <div className="dropdown order-4 order-lg-1">
              <a href="/explore">
                <Button
                  variant="outline-primary align-items-center d-none d-lg-flex flex-nowrap"
                  type="button"
                  // id="dropdownMenuCat"
                  // data-bs-toggle="dropdown"
                  // aria-expanded="false"
                >
                  <i className="fa-regular fa-grid-2 me-2" />
                  Explore
                </Button>
              </a>
              {/* <div className="dropdown-menu animate slideIn mt-3" aria-labelledby="dropdownMenuCat">
                <a className="dropdown-item" href="/explore">
                  <i className="fa-regular fa-hexagon-vertical-nft-slanted me-3" />
                  All NFTs
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-paintbrush-fine me-3" />
                  Art
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-rabbit me-3" />
                  Collectibles
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-server me-3" />
                  Domain Names
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-music me-3" />
                  Music
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-camera me-3" />
                  Photography
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-futbol me-3" />
                  Sports
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-heart-circle-bolt me-3" />
                  Trading Cards
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-money-bills-simple me-3" />
                  Utility
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fa-regular fa-vr-cardboard me-3" />
                  Virtual Worlds
                </a>
              </div> */}
            </div>
            <Nav className="d-flex align-items-lg-center flex-row py-4 py-lg-0 ms-0 ms-lg-auto order-2 order-lg-3">
              <NavDropdown
                title={
                  <>
                    Projects
                    <i className="fa-solid fa-angle-down ms-2" />
                  </>
                }
                id="projects-nav-dropdown"
              >
                <NavDropdown.Item href="https://tegro.finance/" target="__blank">
                  DEX
                </NavDropdown.Item>
                <NavDropdown.Item href="https://tegro.io/wallet/" target="__blank">
                  TON Wallet
                </NavDropdown.Item>
                <NavDropdown.Item href="https://tegro.io/" target="__blank">
                  Tegro Coin
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/rankings">Stats</Nav.Link>
              {props.address && <Nav.Link href="/create-nft">Create</Nav.Link>}
              {!props.address ? (
                <Button
                  variant="secondary ms-4 d-none d-lg-flex align-items-center"
                  // data-bs-toggle="modal"
                  // data-bs-target="#ConnectModal"
                  onClick={() => props.DelabObject.openModal()}
                  // onClick={() => props.openModalConnect()}
                >
                  <i className="fa-solid fa-wallet me-2" />
                  Connect
                </Button>
              ) : (
                <NavDropdown
                  title={
                    <>
                      <img
                        src={
                          props.account?.icon ? props.account.icon : './assets/img/no-user-pic.png'
                        }
                        alt=""
                        className="profile-image"
                        width="42"
                        height="42"
                      />
                    </>
                  }
                  id="profile-nav-dropdown"
                  className="dropdown ms-auto d-none d-lg-block order-3 order-lg-4"
                >
                  <NavDropdown.Item href={`/user?a=${props.address ?? ''}`}>
                    <div className="d-flex align-items-center ps-2">
                      <img
                        src={
                          props.account?.icon ? props.account.icon : './assets/img/no-user-pic.png'
                        }
                        alt=""
                        className="profile-image me-3"
                        width="42"
                        height="42"
                      />
                      <div className="__body">
                        <div className="mb-2 text-white fw-medium fs-16">
                          {smlAddr(props.address ?? '')}
                        </div>
                        <div className="small d-flex align-items-center">
                          <span className="icon-ton me-1" /> {fixAmount(props.balance ?? '0')} TON
                          {/* <span className="color-grey ms-1">~ 0.56$</span> */}
                        </div>
                      </div>
                    </div>
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="/create-nft">Create NFT</NavDropdown.Item> */}
                  {/* <NavDropdown.Item href="/create-nft">Edit profile</NavDropdown.Item> */}
                  <NavDropdown.Item href="#" onClick={() => props.DelabObject.disconnect()}>
                    Disconnect
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};
