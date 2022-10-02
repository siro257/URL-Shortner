import type { NextPage } from 'next';
import { FormEvent, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import { AiOutlineClose } from 'react-icons/ai';

const Home: NextPage = () => {
  const [url, setUrl] = useState<string>();
  const [slug, setSlug] = useState<string>();
  const [err, setErr] = useState<boolean>();
  const [errMsg, setErrMsg] = useState<string>();
  const [created, setCreated] = useState<boolean>();

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
    if (res.status === 409) {
      setErr(true);
      setCreated(false);
      setErrMsg(data.error);
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
            <span>{errMsg}</span>
            <AiOutlineClose
              onClick={() => setErr(false)}
              style={{ position: 'absolute', right: '30%', fontSize: '1.25em', cursor: 'pointer' }}
            />
          </div>
        )}

        {created && !err && (
          <div className={styles.successAlertBox}>
            <a href={`http://localhost:3000/${slug}`}>{`http://localhost:3000/${slug}`}</a>
            <AiOutlineClose
              onClick={() => setCreated(false)}
              style={{ position: 'absolute', right: '30%', fontSize: '1.25em', cursor: 'pointer' }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
