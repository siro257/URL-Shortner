import type { NextPage } from 'next';
import { FormEvent, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import { AiOutlineClose } from 'react-icons/ai';

const Home: NextPage = () => {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [err, setErr] = useState(false);
  const [created, setCreated] = useState(false);

  const urlRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/create-url', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ url: urlRef.current?.value, slug: slugRef.current?.value }),
    });

    const data = await res.json();
    console.log(res);

    console.log(data);
    if (res.status === 409) {
      setErr(true);
      setCreated(false);
    } else if (res.status === 201) {
      setCreated(true);
      setErr(false);
      setUrl(data.url);
      setSlug(data.slug);
    }
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
            ref={urlRef}
            placeholder='Shorten your link'
          />
          <label className={styles.label} htmlFor='slug'>
            slug
          </label>
          <input
            type='text'
            id='slug'
            className={styles.input}
            ref={slugRef}
            placeholder='random if empty'
          />
          <button type='submit' className={styles.formButton}>
            Shorten
          </button>
        </form>

        {err && !created && (
          <div className={styles.errAlertBox}>
            <span>Error has occurred</span>
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
