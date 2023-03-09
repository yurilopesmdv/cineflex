import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"
import COLORS from "../../style/color"

export default function SeatsPage(props) {
    const { setInformation } = props
    const { idSessao } = useParams()
    const [sessionInfos, setSessionInfos] = useState([])
    const [seats, setSeats] = useState([])
    const [selected, setSelected] = useState([])
    const [selectedID, setSelectedID] = useState([])
    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`
        const promise = axios.get(url)
        promise.then((res) => {
            setSessionInfos(res.data)
            setSeats(res.data.seats)
        })
        promise.catch((err) => console.log(err.response.data))
    }, [])
    function selectSeat(seatName, seatID) {
        if (selected.includes(seatName)) {
            const newSelected = selected.filter((seat) => seat !== seatName)
            setSelected(newSelected)
            const newSelectedID = selectedID.filter((seat) => seat !== seatID)
            setSelectedID(newSelectedID)
            
            return
        }
        setSelected([...selected, seatName])
        setSelectedID([...selectedID, seatID])
        console.log(selectedID)
    }
    function nameChange(event) {
        setName(event.target.value)
    }
    function cpfChange(event) {
        setCpf(event.target.value)
    }
    function reserveSeats(name, cpf, selected) {
        const request = {
            ids: selectedID,
            name: name,
            cpf: cpf
        }
        setInformation({
            movie:sessionInfos.movie.title,
            date: sessionInfos.day.date,
            schedule: sessionInfos.name,
            seats: selected,
            name: name,
            cpf: cpf
        })
        
        const urlPost = "https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many"
        const promise = axios.post(urlPost, request)
        promise.then(res => console.log(res.data))
        promise.catch(err => console.log(err.response.data))
    }
    if (seats.length === 0 || sessionInfos.length === 0) {
        return (
            <PageContainer>
                <p>Carregando</p>
            </PageContainer>
        )
    }
    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seats.map((seat) => {
                    return (
                        <SeatItem data-test="seat" onClick={(seat.isAvailable) ? () => selectSeat(seat.name, seat.id) : () => alert("Esse assento não está disponível")}
                            colors={COLORS}
                            key={seat.id}
                            isAvailable={seat.isAvailable}
                            selected={selected}
                            seatID={seat.name}>
                            {seat.name}
                        </SeatItem>
                    )
                })}

            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle color={COLORS[1].color} border={COLORS[1].border} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle color={COLORS[0].color} border={COLORS[0].border} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle color={COLORS[2].color} border={COLORS[2].border} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer>
                Nome do Comprador:
                <input data-test="client-name" placeholder="Digite seu nome..." type="text" value={name} onChange={nameChange} />

                CPF do Comprador:
                <input data-test="client-cpf" placeholder="Digite seu CPF..." type="text" value={cpf} onChange={cpfChange} />
                <Link to={"/sucesso"}>
                    <button data-test="book-seat-btn" onClick={() => reserveSeats(name, cpf, selected)}>Reservar Assento(s)</button>
                </Link>

            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={sessionInfos.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{sessionInfos.movie.title}</p>
                    <p>{sessionInfos.day.weekday} - {sessionInfos.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${props => props.border};         // Essa cor deve mudar
    background-color: ${props => props.color};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid blue;         // Essa cor deve mudar
    background-color: ${(props) => {
        if (!props.isAvailable) {
            return props.colors[2].color
        }
        if (props.isAvailable && !props.selected.includes(props.seatID)) {
            return props.colors[0].color
        }
        if (props.isAvailable && props.selected.includes(props.seatID)) {
            return props.colors[1].color
        }
    }};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`