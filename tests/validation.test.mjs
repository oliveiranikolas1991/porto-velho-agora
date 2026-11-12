import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSignup, validateLogin, validateAviso, validateImage, detectImageType, checkOrigin, parsePositiveId } from '../lib/validation.js';

test('cadastro normaliza o e-mail e valida senha', () => {
  const r = validateSignup({ nome:'  Maria  Silva ', email:' MARIA@EXEMPLO.COM ', senha:'senha-segura-123' });
  assert.deepEqual(r.value, { nome:'Maria Silva', email:'maria@exemplo.com', senha:'senha-segura-123' });
  assert.match(validateSignup({nome:'M', email:'a', senha:'1'}).error, /nome/);
  assert.match(validateSignup({nome:'Maria', email:'erro', senha:'senha-grande'}).error, /e-mail/);
  assert.match(validateSignup({nome:'Maria', email:'a@b.com', senha:'123'}).error, /senha/);
});

test('login exige ambos os dados', () => {
  assert.ok(validateLogin({email:'a@b.com', senha:'12345678'}).value);
  assert.ok(validateLogin({email:'', senha:'12345678'}).error);
});

test('aviso exige campos completos e categoria conhecida', () => {
  assert.ok(validateAviso({titulo:'Feira de domingo',descricao:'Feira na praça central.',categoria:'Feiras',bairro:'Centro'}).value);
  assert.ok(validateAviso({titulo:'x',descricao:'Feira na praça central.',categoria:'Feiras',bairro:'Centro'}).error);
  assert.ok(validateAviso({titulo:'Feira de domingo',descricao:'Feira na praça central.',categoria:'Inexistente',bairro:'Centro'}).error);
});

test('identificação de foto exige assinatura real e tipo correspondente', () => {
  const png = Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,0]);
  assert.equal(detectImageType(png), 'image/png');
  assert.equal(validateImage(png, 'image/png').value.mime, 'image/png');
  assert.ok(validateImage(png, 'image/jpeg').error);
  assert.ok(validateImage(new Uint8Array(2*1024*1024+1), 'image/png').error);
  assert.equal(detectImageType(new Uint8Array(12)), null);
  const jpg = Uint8Array.from([255,216,255,224,0,16,74,70,73,70,0,0]);
  assert.equal(validateImage(jpg, 'image/jpeg').value.mime, 'image/jpeg');
  const webp = Uint8Array.from([82,73,70,70,4,0,0,0,87,69,66,80]);
  assert.equal(validateImage(webp, 'image/webp').value.mime, 'image/webp');
});

test('rotas rejeitam IDs inválidos e origens diferentes', () => {
  assert.equal(parsePositiveId('12'), 12);
  assert.equal(parsePositiveId('0'), null);
  assert.equal(parsePositiveId('12 OR 1=1'), null);
  assert.equal(checkOrigin({headers:new Headers({origin:'https://atacante.com'}),url:'https://app.vercel.app/api/x'}), false);
  assert.equal(checkOrigin({headers:new Headers({origin:'https://app.vercel.app'}),url:'https://app.vercel.app/api/x'}), true);
});
