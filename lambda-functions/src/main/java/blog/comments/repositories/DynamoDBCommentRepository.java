package blog.comments.repositories;

import java.util.Date;
import java.util.List;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig.TableNameOverride;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;

import blog.comments.models.Comment;
import blog.configuration.ApplicationConfiguration;

public class DynamoDBCommentRepository {

    final private static int DEFAULT_LIMIT = 200;

    private DynamoDBMapper mapper;

    public DynamoDBCommentRepository(ApplicationConfiguration configuration) {
        mapper = new DynamoDBMapper(new AmazonDynamoDBClient(),
                new DynamoDBMapperConfig(new TableNameOverride(configuration.getCommentDynamoDBTableName())));
    }

    public List<Comment> findCommentsByPost(String id) {
        Comment comment = new Comment();
        comment.setPostId(id);
        DynamoDBQueryExpression<Comment> queryExpression = new DynamoDBQueryExpression<Comment>()
                .withHashKeyValues(comment);
        queryExpression.withLimit(DEFAULT_LIMIT);

        List<Comment> commentList = mapper.query(Comment.class, queryExpression);
        return commentList;
    }

    public Comment findComment(String id, long date) {
        return mapper.load(Comment.class, id, date);
    }

    public Comment saveComment(Comment comment) {
        comment.setCreatedAt(new Date().getTime());
        mapper.save(comment);

        return mapper.load(comment);
    }
}