use surrealdb::engine::remote::ws::{Client, Ws};
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

use crate::config::Config;

pub struct Database {
    pub client: Surreal<Client>,
}

impl Database {
    pub async fn connect(config: &Config) -> anyhow::Result<Self> {
        let client = Surreal::new::<Ws>(&config.surreal_url).await?;

        client
            .signin(Root {
                username: &config.surreal_user,
                password: &config.surreal_pass,
            })
            .await?;

        client
            .use_ns(&config.surreal_ns)
            .use_db(&config.surreal_db)
            .await?;

        Ok(Database { client })
    }

    pub async fn migrate(&self) -> anyhow::Result<()> {
        // Run initial schema migration
        let migration = include_str!("migrations/v001_initial.surql");

        self.client.query(migration).await?;

        tracing::info!("Applied migration v001_initial");

        Ok(())
    }
}
