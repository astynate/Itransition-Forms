﻿// <auto-generated />
using System;
using Itransition_Forms.Database.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Itransition_Forms.Database.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20241006091700_init")]
    partial class init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("Itransition_Forms.Core.Answers.CheckBoxModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<bool>("DefaultValue")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("default_value");

                    b.Property<Guid>("QuestionModelId")
                        .HasColumnType("char(36)")
                        .HasColumnName("question_id");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("Title");

                    b.HasKey("id");

                    b.ToTable("checkboxes");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Answers.RangeBoxModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<uint>("MaxValue")
                        .HasColumnType("int unsigned")
                        .HasColumnName("max_value");

                    b.Property<uint>("MinValue")
                        .HasColumnType("int unsigned")
                        .HasColumnName("min_value");

                    b.Property<Guid>("QuestionModelId")
                        .HasColumnType("char(36)")
                        .HasColumnName("question_id");

                    b.HasKey("id");

                    b.ToTable("range");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Answers.TextBoxModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<bool>("IsMultiple")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("is_multiple");

                    b.Property<Guid>("QuestionModelId")
                        .HasColumnType("char(36)")
                        .HasColumnName("question_id");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("text");

                    b.HasKey("id");

                    b.ToTable("textboxes");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Form.FormModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("description");

                    b.Property<string>("ImageLink")
                        .HasColumnType("longtext")
                        .HasColumnName("image_link");

                    b.Property<string>("OwnerId")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("owner");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("Title");

                    b.Property<int>("Topic")
                        .HasColumnType("int")
                        .HasColumnName("topics");

                    b.HasKey("id");

                    b.ToTable("forms");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Form.QuestionModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<Guid>("FormModelId")
                        .HasColumnType("char(36)")
                        .HasColumnName("form_id");

                    b.Property<int>("Index")
                        .HasColumnType("int")
                        .HasColumnName("index");

                    b.Property<string>("Question")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("question");

                    b.HasKey("id");

                    b.ToTable("questions");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Links.Entities.CheckBoxLinkModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<Guid>("AnswerId")
                        .HasColumnType("char(36)")
                        .HasColumnName("answer_id");

                    b.Property<bool>("IsChecked")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("is_checked");

                    b.HasKey("id");

                    b.ToTable("checkbox_links");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Links.Entities.FormLinkModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<Guid>("FormModelId")
                        .HasColumnType("char(36)")
                        .HasColumnName("form_id");

                    b.Property<string>("UserEmail")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("user_email");

                    b.HasKey("id");

                    b.ToTable("form_links");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Links.Entities.QuestionLinkModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<Guid>("QuestionModelId")
                        .HasColumnType("char(36)")
                        .HasColumnName("question_id");

                    b.Property<string>("UserEmail")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("user_email");

                    b.HasKey("id");

                    b.ToTable("question_links");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Links.Entities.RangeBoxLinkModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<Guid>("AnswerId")
                        .HasColumnType("char(36)")
                        .HasColumnName("answer_id");

                    b.Property<uint>("Value")
                        .HasColumnType("int unsigned")
                        .HasColumnName("value");

                    b.HasKey("id");

                    b.ToTable("rangebox_links");
                });

            modelBuilder.Entity("Itransition_Forms.Core.Links.Entities.TextBoxLinkModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<Guid>("AnswerId")
                        .HasColumnType("char(36)")
                        .HasColumnName("answer_id");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("text");

                    b.HasKey("id");

                    b.ToTable("textbox_links");
                });

            modelBuilder.Entity("Itransition_Forms.Core.User.UserModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<int>("Color")
                        .HasColumnType("int")
                        .HasColumnName("color");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("email");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("is_admin");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("password");

                    b.HasKey("id");

                    b.ToTable("users");
                });
#pragma warning restore 612, 618
        }
    }
}
