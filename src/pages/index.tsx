import type { NextPage } from 'next';
import { FormEvent, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import { AiOutlineClose } from 'react-icons/ai';

const Home: NextPage = () => {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [err, setErr] = useState(false);
  const [created, setCreated] = useState(false);

  // TODO: validate the inputs
  // slugs shouldn't be empty
  // // randomly generate slug when empty
  // slugs shouldn't be the same (this should be handled by backend)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/create-url', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ url: url, slug: slug }),
    }).then((res) => {
      if (res.status === 409) {
        setErr(true);
        setCreated(false);
      } else if (res.status === 201) {
        setCreated(true);
        setErr(false);
      }
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Link shortner</h1>
        <form action='' className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='url'>
            url
          </label>
          <input
            type='text'
            id='url'
            className={styles.input}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder='Shorten your link'
          />
          <label className={styles.label} htmlFor='slug'>
            slug
          </label>
          <input
            type='text'
            id='slug'
            className={styles.input}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
            }}
            placeholder='random if empty'
          />
          <button type='submit' className={styles.formButton}>
            Shorten
          </button>
        </form>

        {err && !created && (
          <div className={styles.errAlertBox}>
            <span>err</span>
            <AiOutlineClose
              onClick={() => setErr(false)}
              style={{ position: 'absolute', right: '28%', fontSize: '1.25em', cursor: 'pointer' }}
            />
          </div>
        )}

        {created && !err && (
          <div className={styles.successAlertBox}>
            <span>created with slug {slug}</span>
            <AiOutlineClose
              onClick={() => setCreated(false)}
              style={{ position: 'absolute', right: '28%', fontSize: '1.25em', cursor: 'pointer' }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
