import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Button, Card, ListGroup, Badge, Row } from "react-bootstrap";
import AppContext from "../AppContext";
import ErrorView from "./Error";
import MyNavbar from './MyNavbar';
import API from "../API";
import dayjs from "dayjs";
const url = 'http://localhost:3001/images/';

function RowMemeComponent(props) {
    const { imageurl, round,score} = props;
  
    return (
      <Card>
        <Row>
          <Col md={3}>
            <Card.Img src={imageurl} />
            <Card.Body>
              <Card.Title>ROUND {round}</Card.Title>
            </Card.Body>
          </Col>
          <Col md={9}>
          <Card.Text className={score == 0 ? 'text-danger' : 'text-success'}>
              {score === 0 ? 'Hai sbagliato 0 punti in questo round' : 'Hai Indovinato 5 punti in questo round'}
            </Card.Text>
          </Col>
        </Row>
      </Card>
    );
  }

function ViewGameRoute(props) {
    const context = useContext(AppContext);
    const loginState = context.loginState;
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [listmeme, setListmeme] = useState(null);

    const { gameid } = useParams(); // Extract game ID from route parameters
    console.log("quale id mi arraiva "+gameid);

    const handleBack = () => {
      navigate(-1); // Go back to the previous page
    };
    //eseguo la fetch del gioco
    useEffect(() => {
        async function fetchGame() {
            try {
                const ga= await API.getGame(gameid);
                setGame(ga);
                if( ga != null && ga.listmeme !== null)
                {
                        setListmeme(ga.listmeme.split(","));
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchGame();
    }, []);

    return (
        console.log(listmeme),
            <Container>
               {game ? (
                <>
                    <Row>
                      <h1>Punteggio Totale della partita: {game.score.split(',').map(Number).reduce((acc, score) => acc + score, 0)}</h1>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="danger" onClick={handleBack}>
                                Indietro
                            </Button>
                        </Col>
                    </Row>
                    
                        {listmeme ? (
                            listmeme.map((meme, index) => (
                                <Row key={index+1} style={{ padding: '1rem' }}>
                                <RowMemeComponent key={index+1} imageurl={url+meme} round={index+1} score ={game.score.split(',').map(Number)[index]} />
                                </Row>
                            ))
                        ) : (
                            <p>nessun meme disponibile</p>
                        )}  
                </>
               ) : (
                <ErrorView error={game} />
                )}
            </Container>
        );
}

export default ViewGameRoute;
