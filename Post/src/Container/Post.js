import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, likePost, updateCommentInput, addComment, sharePost } from '../Redux/PostSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AiOutlineSend } from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';
import { BiShareAlt } from 'react-icons/bi';
import { BiComment } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import './CreatePostForm.css';

const CreatePostForm = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  const handleCreatePost = () => {
    setIsCreatingPost(true);
  };

  const handleCancel = () => {
    setIsCreatingPost(false);
  };

  const handleSubmit = (values, { resetForm }) => {
    const { title, content, image } = values;
    const post = {
      id: Date.now(),
      title,
      content,
      image: image ? URL.createObjectURL(image) : null,
      likes: 0,
      comments: [],
      shares: 0,
    };
    dispatch(createPost(post));
    resetForm();
    setIsCreatingPost(false);
  };

  const handleLike = (postId) => {
    dispatch(likePost({ postId }));
  };

  const handleComment = (postId, comment) => {
    const trimmedComment = String(comment).trim();
    if (trimmedComment !== '') {
      dispatch(addComment({ postId, comment: trimmedComment }));
      dispatch(updateCommentInput({ postId, value: '' }));
      setCommentValue('');
    }
  };

  const setCommentInput = (postId, value) => {
    dispatch(updateCommentInput({ postId, value }));
  };

  const handleShare = (postId) => {
    dispatch(sharePost({ postId }));
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  });

  return (
    <div className='parent-container'>
    <div className="container">
      <h1 className="heading">Create Post</h1>
      <div className="post-container">
      {posts.length === 0 ? (
        <p className="no-posts">No posts</p>
      ) : (

        posts.map((post) => (
          <div className="post" key={post.id}>
            <h3 className="post-title">{post.title}</h3>
            {post.image && <img className="post-image" src={post.image} alt={post.title} />}
            <div className="post-actions">
              <p onClick={() => handleLike(post.id)}>
                <AiOutlineLike /> {post.likes}
              </p>
              <p onClick={() => setCommentValue(post.id)}>
                <BiComment /> {post.comments.length}
              </p>
              {commentValue === post.id && (
                <div>
                  <input
                    type="text"
                    placeholder="Add comment"
                    value={post.commentInput || ''}
                    onChange={(e) => setCommentInput(post.id, e.target.value)}
                    className="post-input"
                  />
                  <button
                    className="send-button"
                    onClick={() => handleComment(post.id, post.commentInput)}
                  >
                    <AiOutlineSend />
                  </button>
                </div>
              )}
              <p onClick={() => handleShare(post.id)}>
                <BiShareAlt /> {post.shares}
              </p>
            </div>
            <p className="post-content">{post.content}</p>
          </div>
        ))
      )}
      </div>
      {isCreatingPost && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">Upload</h2>
            <Formik
              initialValues={{
                title: '',
                content: '',
                image: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="post-form">
                  <label className="label" htmlFor="title">
                    Title:
                  </label>
                  <Field className="input" type="text" id="title" name="title" />
                  <ErrorMessage className="error-message" name="title" component="div" />

                  <label className="label" htmlFor="content">
                    Content:
                  </label>
                  <Field as="textarea" className="textarea" id="content" name="content" />
                  <ErrorMessage className="error-message" name="content" component="div" />

                  <label className="label" htmlFor="image">
                    add Image<AiOutlinePlus />
                  </label>
                  <input
                    hidden
                    type="file"
                    id="image"
                    name="image"
                    onChange={(event) => {
                      setFieldValue('image', event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage className="error-message" name="image" component="div" />

                  <button className="button" type="submit">
                    Post
                  </button>
                  <button className="button" type="button" onClick={handleCancel}>
                    Cancel
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      <div className="bottom-bar">
    {!isCreatingPost && (
      <button className="createpost-button" onClick={handleCreatePost}>
        Create Post
      </button>
    )}
  </div>
    </div>
    </div>
  );
};

export default CreatePostForm;
