import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeLabTransaction } from '@delab-team/connect';
import { BOC, Coins } from 'ton3';
import { Cell } from 'ton';
import { VldBuilder, vlds } from 'validatorus-react';
import {
  Button,
  ListGroup,
  Alert,
  Row,
  Col,
  Container,
  Form,
  Nav,
  Tab,
  Breadcrumb,
  Card,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import { PageProps } from '../../types/interfaces';

import { CustomNft, CustomNftSingleData } from '../../logic/nft';
import { rawToTon } from '../../logic/utils';
import { CustomIpfs } from '../../logic/ipfs';
import { MarketNft } from '../../logic/loadnft';

interface Attribute {
  trait_type: string;
  value: string;
}

export const CreateNft: React.FC<PageProps> = (props: PageProps) => {
  const [firstRender, setFirstRender] = React.useState<boolean>(false);

  const [uploading, setUploading] = React.useState<boolean>(false);

  const [img1, setImg1] = React.useState<string | null>(null);

  const [attributes, setAttributes] = React.useState<Attribute[]>([
    {
      trait_type: '',
      value: '',
    },
    {
      trait_type: '',
      value: '',
    },
  ]);

  const name = new VldBuilder().with(vlds.VLen, 0, 60).withFname('Name');

  const desc = new VldBuilder().with(vlds.VLen, 0, 700).withFname('Desciption');

  const price = new VldBuilder().with(vlds.VNumber, 0, 1000000000).withFname('Price');

  const collectionAddress = new VldBuilder().with(vlds.VLen, 0, 100).withFname('CollectionAddress');

  const history = useNavigate();

  const marketNFT = new MarketNft();

  const addAttribute = () => {
    if (attributes.length < 10) {
      setAttributes([...attributes, { trait_type: '', value: '' }]);
    }
  };

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  async function uploadImg(e: React.ChangeEvent<HTMLInputElement>): Promise<string | null> {
    const _file = e.target.files?.[0];
    if (!_file) {
      return null;
    }

    // setFile(_file)
    const url = await CustomIpfs.infuraUploadImg(_file);
    return url || null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const url = await uploadImg(e);
    setUploading(false);
    if (url !== null) {
      setImg1(url);
    }
  };

  async function loadCollections(address2: string) {
    if (address2 === '') {
      return undefined;
    }
    const data = await marketNFT.getItemsFromUser(address2, 0);
    if (!data) {
      return undefined;
    }

    //   setPage(page + 1)

    //   setItems(data)
    return true;
  }

  async function createSingleNft() {
    if (!props.address) {
      return;
    }

    if (name.value === '' || desc.value === '' || price.value === '') {
      return;
    }

    const ipfs = new CustomIpfs();

    const metadata = {
      name: name.value,
      description: desc.value,
      marketplace: 'libermall.com',
      attributes: attributes,
      image: `ipfs://${img1}?filename=logo.png`,
    };
    const ipfsData = await ipfs.uploadDataJson(JSON.stringify(metadata));
    if (!ipfsData) {
      return;
    }
    const data: CustomNftSingleData = {
      ownerAddress: props.address,

      // content: Buffer.from(`ipfs://${ipfsData}`, 'utf8').toString('base64'),
      content: `ipfs://${ipfsData}/metadata.json`,
      royaltyParams: {
        royaltyFactor: 0,
        royaltyBase: 0,
        royaltyAddress: props.address,
      },
    };
    const msg = await CustomNft.deploySingleNft(data);

    const toBoc = msg.stateInit.toBoc().toString('base64');
    console.log('toBoc', toBoc);
    console.log('msg', msg);

    console.log('msg.address.toFriendly()', msg.address.toFriendly());

    const trans: DeLabTransaction = {
      to: msg.address.toFriendly({ bounceable: true }),
      value: new Coins('0.01').toNano(),
      stateInit: toBoc,
    };

    props.DeLabConnector.sendTransaction(trans);
  }

  useEffect(() => {
    if (!firstRender) {
      setFirstRender(true);
      props.installScripts();
    }
  }, []);

  return (
    <div id={props.id}>
      <main className="main-page border-top">
        <section className="section pt-5">
          <Container fluid>
            <Breadcrumb className="mb-5">
              <Breadcrumb.Item href="/explore">Explore</Breadcrumb.Item>
              <Breadcrumb.Item active>Create New NFT</Breadcrumb.Item>
            </Breadcrumb>
            <Form>
              <Row>
                <Col lg="5" className="mb-4 mb-lg-0">
                  <div className="upload-nft__box position-sticky" style={{ top: '140px' }}>
                    <Col lg={`${img1 ? '11' : '6'}`} className="w-100 h-100">
                      {img1 ? (
                        <img
                          src={`https://cloudflare-ipfs.com/ipfs/${img1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center flex-column h-100">
                          {uploading ? (
                            <Spinner
                              animation="border"
                              role="status"
                              style={{ width: '5rem', height: '5rem' }}
                            >
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          ) : (
                            <>
                              <i className="fa-regular fa-cloud-arrow-up fa-3x mb-4" />
                              <p className="mb-4">
                                File types supported: JPG, PNG, SVG, GIF, WEBP and MP4 Max. size:
                                15MB Max. resolution: 2000x2000px
                              </p>
                              <Form.Group controlId="formFileNFT">
                                <Form.Label htmlFor="formFileNFT" className="btn btn-secondary">
                                  Upload Files
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  className="d-none"
                                  id="formFileNFT"
                                  onChange={handleFileChange}
                                />
                              </Form.Group>
                            </>
                          )}
                        </div>
                      )}
                    </Col>
                  </div>
                </Col>
                <Col lg="7" className="ms-auto">
                  <h1 className="section__title mb-5">Create New NFT</h1>
                  <Card className="border p-4 mb-4">
                    <Form.Group className="mb-3">
                      <div className="d-flex">
                        <Form.Label className="fw-medium">Display Name</Form.Label>
                        <div className="ms-auto color-grey">
                          <span>{name.value.length}</span>/60
                        </div>
                      </div>
                      <Form.Control
                        type="text"
                        placeholder="Name your NFT"
                        value={name.value}
                        onChange={(e) => name.change(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <div className="d-flex">
                        <Form.Label className="fw-medium">Description</Form.Label>
                        <div className="ms-auto color-grey">
                          <span>{desc.value.length}</span>/700
                        </div>
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Describe the idea behind your NFT and explain how it stands out from the rest."
                        value={desc.value}
                        onChange={(e) => desc.change(e.target.value)}
                      />
                    </Form.Group>
                  </Card>
                  <Card className="border p-4 mb-4">
                    <Card.Title className="fs-20 mb-4">Choose a collection</Card.Title>
                    <Row>
                      <Col sm="6" md="4" lg="6" xl="4" xxl="3" className="mb-3">
                        <Button
                          variant="secondary mb-4 w-100 h-100"
                          data-bs-toggle="modal"
                          data-bs-target="#CreateCollectionModal"
                        >
                          <i className="fa-regular fa-octagon-plus fs-40 mb-4" />
                          <div>New Collection</div>
                          <div className="fs-12 color-grey mt-1">ERC-721</div>
                        </Button>
                      </Col>
                      <Col sm="6" md="4" lg="6" xl="4" xxl="3" className="mb-3">
                        <Form.Check
                          name="radio-group"
                          type="radio"
                          id="SinglNFT"
                          className="card-choose d-flex flex-column aligh-items-ceter justify-content-center position-relative w-100 h-100 p-2"
                        >
                          <Form.Check.Input
                            name="radio-group"
                            type="radio"
                            className="d-none"
                            defaultChecked
                          />
                          <Form.Check.Label className="card-choose__label" htmlFor="SinglNFT" />
                          <i className="fa-solid fa-hexagon-vertical-nft fs-40 mb-4" />
                          <div>Single NFT</div>
                        </Form.Check>
                      </Col>
                      <Col sm="6" md="4" lg="6" xl="4" xxl="3" className="mb-3">
                        <Form.Check
                          name="radio-group"
                          type="radio"
                          id="collection-CatMeta-2"
                          className="card-choose d-block position-relative p-2"
                        >
                          <Form.Check.Input name="radio-group" type="radio" className="d-none" />
                          <Form.Check.Label
                            className="card-choose__label"
                            htmlFor="collection-CatMeta-2"
                          />
                          <Card.Img variant="top card-image" src="./assets/img/collections/2.gif" />
                          <Card.Body className="d-flex align-items-center mt-2">
                            <Card.Title className="mb-0">Rich Cats</Card.Title>
                            <span className="verified-icon ms-2" />
                          </Card.Body>
                        </Form.Check>
                      </Col>
                    </Row>
                  </Card>
                  <Card className="border p-4 mb-4">
                    <Card.Title className="fs-20 mb-4">Attributes</Card.Title>
                    <Row>
                      {attributes.map((attribute, index) => (
                        <Col lg="6" className="mb-3" key={index}>
                          <InputGroup className="mb-3 flex-column bg-transparent">
                            <Form.Control
                              placeholder="Trait type"
                              aria-label="Trait type"
                              className="bg-transparent rounded-0 border-bottom w-100"
                              value={attribute.trait_type}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleAttributeChange(index, 'trait_type', e.target.value)
                              }
                            />
                            <Form.Control
                              placeholder="Value"
                              aria-label="Value"
                              className="bg-transparent rounded-0 border-bottom w-100"
                              value={attribute.value}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleAttributeChange(index, 'value', e.target.value)
                              }
                            />
                          </InputGroup>
                        </Col>
                      ))}
                    </Row>
                    <Button
                      variant="secondary btn-sm"
                      disabled={attributes.length >= 10}
                      onClick={addAttribute}
                    >
                      Add attribute
                    </Button>
                  </Card>
                  <Card className="border p-4 mb-4">
                    <Card.Header className="d-flex mb-2">
                      <div className="me-auto">
                        <Card.Title className="fs-20 mb-2">Put on marketplace</Card.Title>
                        <Card.Text className="color-grey mb-0">
                          Enter price to allow users instantly purchase your NFT
                        </Card.Text>
                      </div>
                      <Form.Check type="switch" id="custom-switch" defaultChecked />
                    </Card.Header>

                    {/* <Tab.Container id="price-tabs" defaultActiveKey="FixedPrice">
                      <Nav variant="pills nav-fill border rounded flex-column flex-sm-row">
                        <Nav.Item>
                          <Nav.Link eventKey="FixedPrice">
                            <i className="fa-regular fa-tag fs-24 me-2"></i>
                            <span className="d-block mt-2">Fixed price</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="second">
                            <i className="fa-regular fa-infinity fs-24 me-2"></i>
                            <span className="d-block mt-2">Open for bids</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="third">
                            <i className="fa-regular fa-timer fs-24 me-2"></i>
                            <span className="d-block mt-2">Timed auction</span>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="FixedPrice" className="pt-4">
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Price</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type="number"
                                placeholder="Enter price for one piece"
                                value={price.value}
                                onChange={(e) => price.change(e.target.value)}
                              />
                              <InputGroup.Text id="basic-addon1">TON</InputGroup.Text>
                            </InputGroup>
                          </Form.Group>
                          <ListGroup>
                            <ListGroup.Item className="d-flex">
                              <div className="fw-medium color-grey">Service fee</div>
                              <div className="ms-auto">1%</div>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex">
                              <div className="fw-medium color-grey">You will receive</div>
                              <div className="ms-auto">—</div>
                            </ListGroup.Item>
                          </ListGroup>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second"></Tab.Pane>
                        <Tab.Pane eventKey="third" className="pt-4">
                          <Form.Group className="mb-4">
                            <Form.Label>Minimum bid</Form.Label>
                            <InputGroup className="mb-1">
                              <Form.Control type="number" placeholder="Enter minimum bid" />
                              <InputGroup.Text id="basic-addon1">TON</InputGroup.Text>
                            </InputGroup>
                            <Form.Text className="text-muted">
                              Bids below this amount won’t be allowed.
                            </Form.Text>
                          </Form.Group>
                          <Row>
                            <Col sm="6">
                              <Form.Group className="mb-4">
                                <Form.Label>Starting Date</Form.Label>
                                <Form.Select>
                                  <option value="1" selected>
                                    Right after listing
                                  </option>
                                  <option value="2">Pick specific date</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col sm="6">
                              <Form.Group className="mb-4">
                                <Form.Label>Expiration Date</Form.Label>
                                <Form.Select>
                                  <option value="1" selected>
                                    1 day
                                  </option>
                                  <option value="2">3 days</option>
                                  <option value="3">7 days</option>
                                  <option value="4">30 days</option>
                                  <option value="5">Pick specific date</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Alert key="warning" variant="warning m-0">
                            <p>
                              Any bid placed in the last 10 minutes extends the auction by 10
                              minutes.
                            </p>
                            <Alert.Link
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#HowAuctionsWorkModal"
                            >
                              Learn more how timed auctions work.
                            </Alert.Link>
                          </Alert>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container> */}

                    <div className="pt-2">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Price</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            placeholder="Enter price for one piece"
                            value={price.value}
                            onChange={(e) => price.change(e.target.value)}
                          />
                          <InputGroup.Text id="basic-addon1">TON</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                      <ListGroup>
                        <ListGroup.Item className="d-flex">
                          <div className="fw-medium color-grey">Service fee</div>
                          <div className="ms-auto">1%</div>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex">
                          <div className="fw-medium color-grey">You will receive</div>
                          <div className="ms-auto">—</div>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </Card>
                  <Button
                    variant="primary fs-18 w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#TransactionModal"
                    disabled={
                      name.error !== '' ||
                      desc.error !== '' ||
                      price.error !== '' ||
                      name.value === '' ||
                      price.value === '' ||
                      desc.value === '' ||
                      uploading ||
                      !img1
                    }
                    onClick={() => createSingleNft()}
                  >
                    Create NFT
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </section>
      </main>
    </div>
  );
};
