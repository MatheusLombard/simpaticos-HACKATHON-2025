const { Router } = require('express')
const scriptAgendamento = require('../scripts/scriptAgendamento')

const router = Router()



// Espera receber do front: { usuario_id, medico_id, data } onde data = 'YYYY-MM-DD HH:MM'
router.post('/agendamentos', async (req, res) => {
    const { usuario_id, medico_id, data } = req.body; // data deve ser horário completo

    // Extrai apenas a data para gerar os horários do dia
    const dataDia = data.split(' ')[0];
    const horaInicioExpediente = 8;
    const horaFimExpediente = 18;
    const duracaoConsultaHoras = 1;

    // Gerar todos os horários possíveis para o dia
    const todosOsHorarios = [];
    for (let hora = horaInicioExpediente; hora < horaFimExpediente; hora += duracaoConsultaHoras) {
        const horario = `${dataDia} ${String(hora).padStart(2, '0')}:00`;
        todosOsHorarios.push(horario);
    }

    try {
        // Consulta horários ocupados para o dia
        const resHorarios = await scriptAgendamento.horariosOcupados(medico_id, dataDia);
        const horariosOcupados = resHorarios.map(ag => ag.horario_agendado);

        const horariosDisponiveis = todosOsHorarios.filter(horario => {
            return !horariosOcupados.includes(horario);
        });

        if (horariosDisponiveis.includes(data)) {
            try {
                const result = await scriptAgendamento.agendar(usuario_id, medico_id, data);
                res.status(201).json({ mensagem: 'Consulta agendada com sucesso!', detalhes: result });
            } catch (error) {
                res.status(500).json({ erro: error.message });
            }
        } else {
            // Horário solicitado está ocupado, retorna lista de horários disponíveis
            res.status(200).json({
                mensagem: 'Horário indisponível. Veja os horários disponíveis para este dia.',
                horariosDisponiveis
            });
        }
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.post('/getAgendamentos', async (req, res) => {
    const { medico_id, data} = req.body;

    const dataDia = data.split(' ')[0];
    const horaInicioExpediente = 8;
    const horaFimExpediente = 18;
    const duracaoConsultaHoras = 1;

    // Gerar todos os horários possíveis para o dia
    const todosOsHorarios = [];
    for (let hora = horaInicioExpediente; hora < horaFimExpediente; hora += duracaoConsultaHoras) {
        const horario = `${dataDia} ${String(hora).padStart(2, '0')}:00`;
        todosOsHorarios.push(horario);
    }

    try {
        // Consulta horários ocupados para o dia
        const resHorarios = await scriptAgendamento.horariosOcupados(medico_id, dataDia);
        const horariosOcupados = resHorarios.map(ag => ag.horario_agendado);

        const horariosDisponiveis = todosOsHorarios.filter(horario => {
            return !horariosOcupados.includes(horario);
        });

        res.status(200).json({ horariosDisponiveis });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }

});

module.exports = router