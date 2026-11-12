-- Porto Velho Agora: esquema PostgreSQL 16+ compatível com Neon.
-- Idempotente para criação inicial. Mudanças futuras exigem migrations específicas.
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS avisos (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  titulo VARCHAR(120) NOT NULL,
  descricao TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('Feiras', 'Buracos', 'Chuvas', 'Eventos', 'Outros')),
  bairro VARCHAR(80) NOT NULL,
  imagem_url VARCHAR(255),
  status VARCHAR(12) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pendente', 'removido')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS avisos_imagens (
  aviso_id BIGINT PRIMARY KEY REFERENCES avisos(id) ON DELETE CASCADE,
  tipo_mime VARCHAR(24) NOT NULL CHECK (tipo_mime IN ('image/jpeg', 'image/png', 'image/webp')),
  conteudo BYTEA NOT NULL,
  tamanho_bytes INTEGER NOT NULL CHECK (tamanho_bytes > 0 AND tamanho_bytes <= 2097152)
);

CREATE TABLE IF NOT EXISTS sessoes (
  token_hash CHAR(64) PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_em TIMESTAMPTZ NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tentativas_login (
  chave_hash CHAR(64) PRIMARY KEY,
  quantidade INTEGER NOT NULL DEFAULT 0,
  ultima_tentativa TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avisos_ativos_data ON avisos (criado_em DESC, id DESC) WHERE status = 'ativo';
CREATE INDEX IF NOT EXISTS idx_avisos_usuario ON avisos (usuario_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes (usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_expiracao ON sessoes (expira_em);
