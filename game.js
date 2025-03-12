require('../settings');
const { sleep, clockString } = require('./function')

function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}

const rdGame = (bd, id, tm) => Object.keys(bd).find(a => a.startsWith(id) && a.endsWith(tm));
const iGame = (bd, id) => (a => a && bd[a].id)(Object.keys(bd).find(a => a.startsWith(id)));
const tGame = (bd, id) => (a => a && bd[a].time)(Object.keys(bd).find(a => a.startsWith(id)));

const gameSlot = async (conn, m, db) => {
	if (db.users[m.sender].limit < 1) return m.reply(global.mess.limit)
	const sotoy = ['🍇','🍉','🍋','🍌','🍎','🍑','🍒','🫐','🥥','🥑']
	const slot1 = pickRandom(sotoy)
	const slot2 = pickRandom(sotoy)
	const slot3 = pickRandom(sotoy)
	const listSlot1 = `${pickRandom(sotoy)} : ${pickRandom(sotoy)} : ${pickRandom(sotoy)}`
	const listSlot2 = `${slot1} : ${slot2} : ${slot3}`
	const listSlot3 = `${pickRandom(sotoy)} : ${pickRandom(sotoy)} : ${pickRandom(sotoy)}`
	const randomLimit = Math.floor(Math.random() * 10)
	const botNumber = await conn.decodeJid(conn.user.id)
	try {
		if (slot1 === slot2 && slot2 === slot3) {
			db.users[m.sender].limit -= 1
			db.set[botNumber].limit += 1
			let sloth =`[  🎰VIRTUAL SLOT 🎰  ]\n------------------------\n\n${listSlot1}\n${listSlot2} <=====\n${listSlot3}\n\n------------------------\n[  🎰 VIRTUAL SLOT 🎰  ]\n\n*Información* :\n_Tu Ganas🎉_ <=====Limit + ${randomLimit}, Dinero + ${randomLimit * 500}`
			conn.sendMessage(m.chat, { text: sloth }, { quoted: m })
			db.users[m.sender].limit += randomLimit
			db.users[m.sender].exp += randomLimit * 500
		} else {
			db.users[m.sender].limit -= 1
			db.set[botNumber].limit += 1
			let sloth =`[  🎰VIRTUAL SLOT 🎰  ]\n------------------------\n\n${listSlot1}\n${listSlot2} <=====\n${listSlot3}\n\n------------------------\n[  🎰 VIRTUAL SLOT 🎰  ]\n\n*Información* :\n_Tu Pierdes_ <=====\nLimit - 1`
			conn.sendMessage(m.chat, { text: sloth }, { quoted: m })
		}
	} catch (e) {
		console.log(e)
		m.reply('Error!')
	}
}

const gameCasinoSolo = async (conn, m, prefix, db) => {
    try {
        let buatall = 1;
        const botNumber = await conn.decodeJid(conn.user.id);

        // Verificar si el usuario ingresó una cantidad válida
        if (!m.args[0]) return m.reply(`❌ Ingresa la cantidad de EXP a apostar.\nEjemplo: ${prefix + m.command} 1000`);
        let count = parseInt(m.args[0]);
        if (isNaN(count) || count <= 0) return m.reply(`❌ Cantidad no válida.\nEjemplo: ${prefix + m.command} 1000`);

        // Verificar si el usuario y el bot tienen un perfil en la base de datos
        if (!db.users[m.sender]) db.users[m.sender] = { exp: 0 };
        if (!db.set[botNumber]) db.set[botNumber] = { exp: 0 };

        // Verificar si el usuario tiene suficiente EXP
        if (db.users[m.sender].exp < count) return m.reply(`❌ No tienes suficiente EXP para apostar.`);
        
        // Generar números aleatorios para el juego
        let Aku = Math.floor(Math.random() * 101);
        let Kamu = Math.floor(Math.random() * 81);

        // Apostar restando la EXP del usuario
        db.users[m.sender].exp -= count;
        db.set[botNumber].exp += count;

        // DEBUG: Mostrar en consola los valores de juego
        console.log(`DEBUG Casino:`, { Aku, Kamu, count, userExp: db.users[m.sender].exp });

        // Evaluar el resultado del juego
        if (Aku > Kamu) {
            m.reply(`💰 Casino 💰\n*Tú:* ${Kamu} Punto\n*Computadora:* ${Aku} Punto\n\n*Tu PIERDES*\nPerdiste ${count} EXP`);
        } else if (Aku < Kamu) {
            let expGanado = count * 2;
            db.users[m.sender].exp += expGanado;
            m.reply(`💰 Casino 💰\n*Tú:* ${Kamu} Punto\n*Computadora:* ${Aku} Punto\n\n*Tu Ganas*\nObtienes ${expGanado} EXP`);
        } else {
            db.users[m.sender].exp += count;
            m.reply(`💰 Casino 💰\n*Tú:* ${Kamu} Punto\n*Computadora:* ${Aku} Punto\n\n*Empate*\nRecuperas tu apuesta de ${count} EXP`);
        }

    } catch (e) {
        console.error("❌ ERROR en el casino:", e); // Muestra el error exacto en la consola
        m.reply('❌ Error en el casino. Revisa la consola para más detalles.');
    }
};

const gameMerampok = async (m, db) => {
	let __timers = (new Date - db.users[m.sender].lastrampok)
	let _timers = (3600000 - __timers)
	let timers = clockString(_timers)
	if (new Date - db.users[m.sender].lastrampok > 3600000) {
		let dapat = (Math.floor(Math.random() * 10000))
		let who
		if (m.isGroup) who = m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.mentionedJid[0]
		else who = m.chat
		if (!who) return m.reply('Etiqueta uno')
		if (!db.users[who]) return m.reply('¡El objetivo no está registrado en la base de datos!')
		if (10000 > db.users[who].uang) return m.reply('El objetivo es Kismin ngab🗿')
		db.users[who].uang -= dapat
		db.users[m.sender].exp += dapat
		db.users[m.sender].lastrampok = new Date * 1
		m.reply(`Robó con éxito al objetivo dinero por valor de ${dapat}`)
	} else {
		m.reply(`Robaste y lograste esconderte, espera ${timers} para robar nuevamente`)
	}
}

const gameBegal = async (conn, m, db) => {
	let user = db.users[m.sender]
    let __timers = (new Date - user.lastbegal)
    let _timers = (3600000 - __timers)
    let timers = clockString(_timers)
    const botNumber = await conn.decodeJid(conn.user.id)
	const randomUang = Math.floor(Math.random() * 10001)
	let random = [{teks: '¡El jugador escapó con éxito!', no: 0},{teks: '¡Los jugadores escapan!', no: 0},{teks: 'Jugador escondido', no: 0},{teks: 'Suicidio del jugador', no: 2},{teks: 'Jugador atrapado con éxito', no: 2},{teks: '¡Jugador no encontrado!', no: 0},{teks: '¡Jugadores más fuertes que tú!', no: 1},{teks: 'Los jugadores usan trucos', no: 1},{teks: 'Jugador denuncia a la policía', no: 0},{teks: '¡Jugador atrapado!', no: 2},{teks: 'Los jugadores se rinden', no: 2}]
	let teksnya = await pickRandom(random);
	if (new Date - user.lastbegal > 3600000) {
		let { key } = await m.reply('Sedang Mencari Pemain...')
		await sleep(2000)
		if (teksnya.no === 0) {
			await m.reply({ text: teksnya.teks, edit: key })
			await m.reply('Gagal Mencari Pemain, Silahkan Coba lagi')
		} else if (teksnya.no === 1) {
			await m.reply({ text: teksnya.teks, edit: key })
			await m.reply(`Kamu Di Bunuh Oleh Pemain\nUang Kamu Di Rampas Sebesar *${randomUang}*`)
			db.users[m.sender].exp -= randomUang
			db.set[botNumber].uang += randomUang * 1
		} else {
			await m.reply({ text: teksnya.teks, edit: key })
			await m.reply(`Berhasil Mendapatkan Uang Sebesar : *${randomUang}*`)
			db.users[m.sender].exp += randomUang
			db.users[m.sender].lastbegal = new Date * 1
		}
	} else {
		m.reply(`Silahkan tunggu *⏱️${timers}* lagi untuk bisa bermain lagi`)
	}
}

const daily = async (m, db) => {
	let user = db.users[m.sender]
	let __timers = (new Date - user.lastclaim)
	let _timers = (86400000 - __timers)
	let timers = clockString(_timers)
	if (new Date - user.lastclaim > 86400000) {
		m.reply(`*Daily Claim*\n_Berhasil Claim_\n- limit : 10\n- uang : 10000\n\n_Claim Di Reset_`)
		db.users[m.sender].limit += 10
		db.users[m.sender].exp += 10000
		db.users[m.sender].lastclaim = new Date * 1
	} else {
		m.reply(`Silahkan tunggu *⏱️${timers}* lagi untuk bisa mengclaim lagi`)
	}
}

const buy = async (m, args, db) => {
	if (args[0] === 'limit') {
		if (!args[1]) return m.reply(`Masukkan Nominalnya!\nExample : ${m.prefix + m.command} limit 10`);
		let count = parseInt(args[1])
		if (db.users[m.sender].exp >= count * 1) {
			db.users[m.sender].limit += count * 1
			db.users[m.sender].exp -= count * 100
			m.reply(`Berhasil Membeli Limit Sebanyak ${args[1] * 1} dengan harga ${args[1] * 500}`);
		} else {
			m.reply(`Uang Kamu Tidak Cukup Untuk Membeli limit!\nUangmu Tersisa : ${db.users[m.sender].exp}\nHarga ${args[1]} Limit : ${args[1] * 500}`);
		}
	} else {
		m.reply(`Harga Limit : Jumlah x 500\n• 1 limit = 500\n• 2 limit = 1000\n\nExample : .buy limit 3`);
	}
}

const setLimit = (m, db) => db.users[m.sender].limit -= 1

const addLimit = (jumlah, no, db) => db.users[no].limit += parseInt(jumlah)

const setUang = (m, db) => db.users[m.sender].exp -= 1000

const addUang = (jumlah, no, db) => db.users[no].uang += parseInt(jumlah)

const transfer = async (m, args, db) => {
	if (args[0] == 'limit') {
		if (!args[1].length > 7) return m.reply(`Transfer Menu :\nExample : ${m.prefix + m.command} limit @tag 11\n• ${m.prefix + m.command} limit @tag jumlah\n• ${m.prefix + m.command} uang @tag jumlah`);
		let count = parseInt(args[2] && args[2].length > 0 ? Math.min(9999999, Math.max(parseInt(args[2]), 1)) : Math.min(1))
		let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[1] ? (args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net') : false
		if (!who) return m.reply('Siapa yg mau di transfer?')
		if (db.users[who]) {
			if (db.users[m.sender].limit >= count * 1) {
				try {
					db.users[m.sender].limit -= count * 1
					db.users[who].limit += count * 1
					m.reply(`Berhasil mentransfer limit sebesar ${count}, kepada @${who.split('@')[0]}`)
				} catch (e) {
					db.users[m.sender].limit += count * 1
					m.reply('Gagal Transfer')
				}
			} else {
				m.reply(`Limit tidak mencukupi!!\nLimit mu tersisa : *${db.users[m.sender].limit}*`)
			}
		} else m.reply(`Nomer ${who.split('@')[0]} Bukan User bot!`)
	} else if (args[0] == 'uang') {
		if (!args[1].length > 7) return m.reply(`Transfer Menu :\nExample : ${m.prefix + m.command} limit @tag 11\n• ${m.prefix + m.command} limit @tag jumlah\n• ${m.prefix + m.command} uang @tag jumlah`);
		let count = parseInt(args[2] && args[2].length > 0 ? Math.min(9999999, Math.max(parseInt(args[2]), 1)) : Math.min(1))
		let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[1] ? (args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net') : false
		if (!who) return m.reply('Siapa yg mau di transfer?')
		if (db.users[who]) {
			if (db.users[m.sender].exp >= count * 1) {
				try {
					db.users[m.sender].exp -= count * 1
					db.users[who].uang += count * 1
					m.reply(`Berhasil mentransfer uang sebesar ${count}, kepada @${who.split('@')[0]}`)
				} catch (e) {
					db.users[m.sender].exp += count * 1
					m.reply('Gagal Transfer')
				}
			} else {
				m.reply(`Uang tidak mencukupi!!\Uang mu tersisa : *${db.users[m.sender].exp}*`)
			}
		} else m.reply(`Nomer ${who.split('@')[0]} Bukan User bot!`)
	} else {
		m.reply(`Transfer Menu :\nExample : ${m.prefix + m.command} limit @tag 11\n• ${m.prefix + m.command} limit @tag jumlah\n• ${m.prefix + m.command} uang @tag jumlah`);
	}
}

module.exports = { rdGame, iGame, tGame, gameSlot, gameCasinoSolo, gameMerampok, gameBegal, daily, buy, setLimit, addLimit, addUang, setUang, transfer }