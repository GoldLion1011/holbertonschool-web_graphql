const _ = require('lodash');
const mongoose = require('mongoose');
const Task = require('../models/task');
const Project = require('../models/project');

const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
 } = require('graphql');


// TaskType definition
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields:  () => ({
    id: { type: GraphQLID }, 
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve: (parent, args) => {
        return Project.findById(parent.projectId);
      }
    }
  })  
});

 // ProjectType definition
 const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: (parent, args) => {
        return Task.find({ projectId: parent.id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const newProject = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description,
        });
        return newProject.save();
      }
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        project: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const newTask = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description,
          projectId: args.project,
        });
        return newTask.save();
      }
    }    
  })
});

// RootQuery definition
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
      // mutation: Mutation,
      },
      resolve: (parent, args) => {
        return Task.findById(args.id);
      },
    },
    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return Project.findById(args.id);
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: () => {
        return Task.find({});
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: () => {
        return Project.find({});
      }
    }
  },
});


module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutation
});
